package com.test.besearch.search;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Getter;

@Entity
@Getter
public class Patient {

    @Id
    @Column(name = "patient_id")
    private Long id;

    private String name;

    private String phone;

    @Column(name = "is_foreign")
    private boolean foreign;

}
