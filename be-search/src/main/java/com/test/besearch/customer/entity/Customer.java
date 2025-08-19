package com.test.besearch.customer.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.List;
import lombok.Getter;

@Entity
@Getter
@Table(name = "patient")
public class Customer {

    @Id
    @Column(name = "patient_id")
    private Long id;

    private String name;

    private String phone;

    @Column(name = "is_foreign")
    private boolean foreign;

    @OneToMany(mappedBy = "customer", fetch = FetchType.LAZY)
    private List<Patient> patients;

}
