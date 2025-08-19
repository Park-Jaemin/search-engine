package com.test.besearch.customer;

import static com.test.besearch.customer.entity.QCustomer.customer;

import com.querydsl.core.types.Order;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.core.types.dsl.PathBuilder;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.test.besearch.customer.entity.Customer;
import com.test.besearch.search.SearchParam;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

@RequiredArgsConstructor
public class CustomerQueryDslImpl implements CustomerQueryDsl {

    private final JPAQueryFactory queryFactory;

    @Override
    public Page<Customer> findByPhoneEndsWith(SearchParam param, Pageable pageable) {
        if (param == null || pageable == null) {
            return new PageImpl<>(Collections.emptyList(), Pageable.unpaged(), 0);
        }

        JPAQuery<Customer> base = queryFactory
                .selectFrom(customer)
                .where(
                        endsWithPhone(param.phone()),
                        containsIgnoreCaseName(param.name()),
                        equalsHospital(param.hospitalId())
                );

        Long totalCount = base.clone()
                .select(customer.id.countDistinct())
                .fetchOne();
        long total = totalCount == null ? 0L : totalCount;

        if (total == 0L) {
            return new PageImpl<>(Collections.emptyList(), pageable, 0);
        }

        List<OrderSpecifier<?>> orders = toOrderSpecifiers(pageable.getSort());

        List<Customer> content = base.clone()
                .distinct()
                .orderBy(orders.toArray(new OrderSpecifier[0]))
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        return new PageImpl<>(content, pageable, total);
    }

    private BooleanExpression endsWithPhone(String phone) {
        return phone == null ? null : customer.phone.endsWith(phone);
    }

    private BooleanExpression containsIgnoreCaseName(String name) {
        return name == null ? null : customer.name.containsIgnoreCase(name);
    }

    private BooleanExpression equalsHospital(Long hospitalId) {
        return hospitalId == null ? null : customer.patients.any().hospital.id.eq(hospitalId);
    }

    private List<OrderSpecifier<?>> toOrderSpecifiers(Sort sort) {
        List<OrderSpecifier<?>> orderSpecifiers = new ArrayList<>();
        if (sort == null || sort.isUnsorted()) {
            orderSpecifiers.add(customer.id.desc());
            return orderSpecifiers;
        }

        PathBuilder<Customer> path = new PathBuilder<>(Customer.class, customer.getMetadata());
        for (Sort.Order o : sort) {
            String prop = o.getProperty();
            Order direction = o.isAscending() ? Order.ASC : Order.DESC;
            switch (prop) {
                case "id" ->
                        orderSpecifiers.add(new OrderSpecifier<>(direction, Expressions.numberPath(Long.class, path, prop)));
                case "name", "phone" ->
                        orderSpecifiers.add(new OrderSpecifier<>(direction, Expressions.stringPath(path, prop)));
            }
        }
        if (orderSpecifiers.isEmpty()) {
            orderSpecifiers.add(customer.id.desc());
        }
        return orderSpecifiers;
    }

}
