package com.test.besearch.customer.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDate;
import lombok.Getter;

@Entity
@Getter
@Table(name = "patient_detail")
public class Patient {

    @Id
    @Column(name = "patient_detail_id")
    private Long id;

    @Column(name = "vip_type", length = 20)
    private String vipType;

    @Column(name = "classification_cd", nullable = false, length = 20)
    private String classificationCd;

    @Column(name = "first_visit_date")
    private LocalDate firstVisitDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id")
    @JsonIgnore
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hospital_id")
    @JsonIgnore
    private Hospital hospital;

}
