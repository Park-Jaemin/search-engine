package com.test.besearch.search;

import com.test.besearch.customer.CustomerService;
import com.test.besearch.customer.entity.Customer;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.client.elc.NativeQueryBuilder;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.data.elasticsearch.core.mapping.IndexCoordinates;
import org.springframework.data.elasticsearch.core.query.Query;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class SearchService {

    private final CustomerService customerService;
    private final ElasticsearchOperations elasticsearchOperations;

    public SearchResult<Customer> searchDb(SearchParam param, Pageable pageable) {
        Page<Customer> patientPage = customerService.searchDb(param, pageable);
        return SearchResult.from(patientPage);
    }

    public SearchResult<Customer> searchEl(SearchParam param, Pageable pageable) {
        Map<String, String> sortableFieldMap = Map.of(
                "name", "name.keyword",
                "phone", "phone"
        );

        NativeQueryBuilder builder = NativeQuery.builder();

        boolean hasName = param.name() != null && !param.name().isBlank();
        boolean hasPhone = param.phone() != null && !param.phone().isBlank();
        boolean hasHospital = param.hospitalId() != null;

        builder.withQuery(q -> q.bool(b -> {
            if (hasName) {
                b.must(m -> m.match(mm -> mm.field(param.name().length() > 1 ? "name.2gram" : "name.1gram").query(param.name())));
            }
            if (hasPhone) {
                String reversed = new StringBuilder(param.phone()).reverse().toString();
                b.must(m -> m.prefix(p -> p.field("phone_rev").value(reversed)));
            }
            if (hasHospital) {
                // nested 필터: 특정 병원에 속한 환자가 존재하는 고객만
                b.filter(f -> f.nested(n -> n
                        .path("patients")
                        .query(nq -> nq.term(t -> t.field("patients.hospitalId").value(param.hospitalId())))
                ));
            }
            if (!hasName && !hasPhone && !hasHospital) {
                b.must(m -> m.matchAll(ma -> ma));
            }
            return b;
        }));

        Pageable safePageable = getSafePageable(pageable, sortableFieldMap);
        Query query = builder
                .withPageable(safePageable)
                .build();

        SearchHits<Customer> hits = elasticsearchOperations.search(query, Customer.class, IndexCoordinates.of("patient-index"));

        List<Customer> content = hits.getSearchHits().stream()
                .map(SearchHit::getContent)
                .toList();

        Page<Customer> page = new PageImpl<>(content, pageable, hits.getTotalHits());
        return SearchResult.from(page);
    }

    private Pageable getSafePageable(Pageable pageable, Map<String, String> propertyToEsField) {
        if (pageable == null || pageable.getSort().isUnsorted()) {
            return pageable;
        }
        List<Sort.Order> safeOrders = pageable.getSort().stream()
                .map(order -> {
                    String mapped = propertyToEsField.get(order.getProperty());
                    if (mapped == null || mapped.isBlank()) {
                        return null;
                    }
                    Sort.Order newOrder = new Sort.Order(order.getDirection(), mapped);
                    if (order.isIgnoreCase()) {
                        newOrder = newOrder.ignoreCase();
                    }
                    return newOrder;
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        Sort safeSort = safeOrders.isEmpty() ? Sort.unsorted() : Sort.by(safeOrders);
        return PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), safeSort);
    }

}
