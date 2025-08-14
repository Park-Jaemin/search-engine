package com.test.besearch.search;

import java.util.List;
import lombok.Builder;
import org.springframework.data.domain.Page;

@Builder
public record SearchResult<T>(
        long totalPage,
        List<Object> cursor,
        boolean hasNext,
        List<T> contents
) {

    public static <T> SearchResult<T> from(Page<T> page, List<Object> cursor) {
        return SearchResult.<T>builder()
                .totalPage(page.getTotalPages())
                .cursor(cursor)
                .hasNext(page.hasNext())
                .contents(page.getContent())
                .build();
    }

}
