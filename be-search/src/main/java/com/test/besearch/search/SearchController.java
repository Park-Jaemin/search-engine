package com.test.besearch.search;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class SearchController {

    private final SearchService searchService;

    @GetMapping("/db")
    public ResponseEntity<?> searchDb(SearchParam param, @PageableDefault Pageable pageable) {
        return ResponseEntity.ok(searchService.searchDb(param, pageable));
    }

    @GetMapping("/el")
    public ResponseEntity<?> searchEl(SearchParam param, @PageableDefault Pageable pageable) {
        return ResponseEntity.ok(searchService.searchEl(param, pageable));
    }

}
