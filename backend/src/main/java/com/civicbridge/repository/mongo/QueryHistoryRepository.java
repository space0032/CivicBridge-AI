package com.civicbridge.repository.mongo;

import com.civicbridge.model.QueryHistory;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QueryHistoryRepository extends MongoRepository<QueryHistory, String> {
    List<QueryHistory> findByUserId(Long userId);
    List<QueryHistory> findByUserIdOrderByTimestampDesc(Long userId);
}
