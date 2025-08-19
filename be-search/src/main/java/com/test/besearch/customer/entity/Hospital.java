package com.test.besearch.customer.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Getter;

@Entity
@Getter
public class Hospital {

    @Id
    @Column(name = "hospital_id")
    private Long id;

}
