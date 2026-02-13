package com.civicbridge.repository.jpa;

import com.civicbridge.model.HealthcareFacility;
import org.springframework.data.jpa.domain.Specification;

public class HealthcareFacilitySpecifications {

    public static Specification<HealthcareFacility> hasType(String type) {
        return (root, query, criteriaBuilder) -> (type == null || type.isEmpty()) ? criteriaBuilder.conjunction()
                : criteriaBuilder.equal(root.get("type"), type);
    }

    public static Specification<HealthcareFacility> hasFreeServices(Boolean freeServices) {
        return (root, query, criteriaBuilder) -> (freeServices == null || !freeServices) ? criteriaBuilder.conjunction()
                : criteriaBuilder.equal(root.get("freeServices"), true);
    }

    public static Specification<HealthcareFacility> isActive() {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("isActive"), true);
    }
}
