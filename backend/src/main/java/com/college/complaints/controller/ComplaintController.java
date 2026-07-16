package com.college.complaints.controller;

import com.college.complaints.entity.Complaint;
import com.college.complaints.entity.Role;
import com.college.complaints.entity.User;
import com.college.complaints.security.UserPrincipal;
import com.college.complaints.service.ComplaintService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {

    @Autowired
    private ComplaintService complaintService;

    // Student: Submit complaint
    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    public ResponseEntity<?> submitComplaint(@RequestBody Complaint complaint, @AuthenticationPrincipal UserPrincipal userPrincipal) {
        try {
            Complaint saved = complaintService.createComplaint(complaint, userPrincipal.getUser());
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Student: Get my complaints
    @GetMapping("/my")
    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    public ResponseEntity<List<Complaint>> getMyComplaints(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<Complaint> myComplaints = complaintService.getComplaintsByStudent(userPrincipal.getUser());
        return ResponseEntity.ok(myComplaints);
    }

    // Admin: Get all complaints
    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<Complaint>> getAllComplaints() {
        List<Complaint> allComplaints = complaintService.getAllComplaints();
        return ResponseEntity.ok(allComplaints);
    }

    // Admin: Update complaint (change status / assign staff)
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> updateComplaintStatus(
            @PathVariable Long id,
            @RequestBody UpdateComplaintRequest request) {
        try {
            Complaint updated = complaintService.updateComplaint(id, request.getStatus(), request.getAssignedStaff());
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    public static class UpdateComplaintRequest {
        private String status;
        private String assignedStaff;

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public String getAssignedStaff() { return assignedStaff; }
        public void setAssignedStaff(String assignedStaff) { this.assignedStaff = assignedStaff; }
    }
}
