package com.college.complaints.service;

import com.college.complaints.entity.Complaint;
import com.college.complaints.entity.User;
import com.college.complaints.repository.ComplaintRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ComplaintService {

    @Autowired
    private ComplaintRepository complaintRepository;

    public Complaint createComplaint(Complaint complaint, User student) {
        complaint.setUser(student);
        complaint.setStatus("Pending");
        complaint.setAssignedStaff(null);
        return complaintRepository.save(complaint);
    }

    public List<Complaint> getComplaintsByStudent(User student) {
        return complaintRepository.findByUserOrderByCreatedDateDesc(student);
    }

    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAllByOrderByCreatedDateDesc();
    }

    public Optional<Complaint> getComplaintById(Long id) {
        return complaintRepository.findById(id);
    }

    public Complaint updateComplaint(Long id, String status, String assignedStaff) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found with id: " + id));

        if (status != null && !status.trim().isEmpty()) {
            complaint.setStatus(status);
        }
        
        if (assignedStaff != null) {
            complaint.setAssignedStaff(assignedStaff);
        }

        return complaintRepository.save(complaint);
    }
}
