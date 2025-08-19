package com.test.besearch.search;

import java.util.List;
import lombok.Builder;
import org.springframework.data.domain.Page;

@Builder
public record SearchResult<T>(
        long totalPage,
        List<T> contents
) {

    public static <T> SearchResult<T> from(Page<T> page) {
        return SearchResult.<T>builder()
                .totalPage(page.getTotalPages())
                .contents(page.getContent())
                .build();
    }

}
