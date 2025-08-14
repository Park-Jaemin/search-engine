package com.test.besearch.search;

import java.util.Arrays;
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

    private final PatientRepository patientRepository;
    private final ElasticsearchOperations elasticsearchOperations;

    public SearchResult<Patient> searchDb(SearchParam param, Pageable pageable) {
        Page<Patient> patientPage;
        if (param.phone() == null) {
            patientPage = patientRepository.findByNameContainingIgnoreCase(param.name(), pageable);
        } else if (param.name() == null) {
            patientPage = patientRepository.findByPhoneEndsWith(param.phone(), pageable);
        } else {
            patientPage = patientRepository.findByNameContainingIgnoreCaseAndPhoneEndsWith(param.name(), param.phone(), pageable);
        }
        return SearchResult.from(patientPage, null);
    }

    public SearchResult<Patient> searchEl(SearchParam param, Pageable pageable) {
        IndexCoordinates index = IndexCoordinates.of("patient");

        Map<String, String> sortableFieldMap = Map.of(
                "name", "name.keyword",
                "phone", "phone.keyword"
        );

        NativeQueryBuilder builder = NativeQuery.builder();
        boolean hasFilter = param.name() != null && !param.name().isBlank();
        if (param.phone() != null && !param.phone().isBlank()) {
            hasFilter = true;
        }
        if (hasFilter) {
            builder.withQuery(q -> q.bool(b -> {
                if (param.name() != null && !param.name().isBlank()) {
                    b.must(m -> m.wildcard(ma -> ma.field("name").value("*" + param.name() + "*")));
                }
                if (param.phone() != null && !param.phone().isBlank()) {
                    b.must(m -> m.wildcard(w -> w.field("phone").value("*" + param.phone())));
                }
                return b;
            }));
        } else {
            builder.withQuery(q -> q.matchAll(m -> m));
        }

        Pageable safePageable = getSafePageable(pageable, sortableFieldMap);
        System.out.println(param.cursor() == null ? null : Arrays.asList(param.cursor().split(",")));
        Query query = builder
                .withSearchAfter(param.cursor() == null ? List.of() : Arrays.asList(param.cursor().split(",")))
                .withPageable(safePageable)
                .build();

        SearchHits<Patient> hits = elasticsearchOperations.search(query, Patient.class, index);

        List<Patient> content = hits.getSearchHits().stream()
                .map(SearchHit::getContent)
                .toList();

        List<SearchHit<Patient>> hitList = hits.getSearchHits();
        List<Object> nextCursor = hitList.isEmpty() ? null : hitList.get(hitList.size() - 1).getSortValues();
        Page<Patient> page = new PageImpl<>(content, pageable, hits.getTotalHits());
        return SearchResult.from(page, nextCursor);
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
