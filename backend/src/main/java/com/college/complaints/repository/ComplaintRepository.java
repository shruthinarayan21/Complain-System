package com.college.complaints.repository;

import com.college.complaints.entity.Complaint;
import com.college.complaints.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    List<Complaint> findByUserOrderByCreatedDateDesc(User user);
    List<Complaint> findAllByOrderByCreatedDateDesc();
}
