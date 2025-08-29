package com.example.backend.controller;

import com.example.backend.dto.request.CreateMultipleShowingTimeRequest;
import com.example.backend.dto.request.UpdateShowingTimeRequest;
import com.example.backend.dto.response.LayoutDTO;
import com.example.backend.dto.response.ResponseData;
import com.example.backend.dto.response.ShowingTimeAdmin;
import com.example.backend.model.ShowingTime;
import com.example.backend.service.ShowingTimeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/events/showing-times")
@RequiredArgsConstructor
public class ShowingTimeController {

    private  final ShowingTimeService showingTimeService;

    @PreAuthorize("hasRole('ORGANIZER')")
    @PostMapping("/create")
    public ResponseData<List<ShowingTime>> createMultiple(@RequestBody CreateMultipleShowingTimeRequest req) {
        List<ShowingTime> created = showingTimeService.createMultipleShowingTimes(req);
        return new ResponseData<>(HttpStatus.CREATED.value(), "Suất chiếu được thêm thành công", created);
    }

    @GetMapping("/{id}/layout")
    @ResponseStatus(HttpStatus.OK)
    public ResponseData<LayoutDTO> getLayout(@PathVariable int id) {
        LayoutDTO layout = showingTimeService.getLayout(id);
        return new ResponseData<>(200, "OK", layout);
    }

    @PreAuthorize("hasRole('ORGANIZER')")
    @PutMapping("/{id}")
    public ResponseData<ShowingTime> updateSingle(@PathVariable int id, @RequestBody UpdateShowingTimeRequest req) {
        ShowingTime updated = showingTimeService.updateShowingTime(id, req);
        return new ResponseData<>(200, "Cập nhật sự kiện thành công", updated);
    }
    //thêm suất chiếu khi edit sự kiện
    @PreAuthorize("hasRole('ORGANIZER')")
    @PostMapping("/create-single")
    public ResponseData<ShowingTime> createSingle(@RequestBody UpdateShowingTimeRequest req) {
        ShowingTime created = showingTimeService.createShowingTime(req);
        return new ResponseData<>(HttpStatus.CREATED.value(), "Tạo suất chiếu thành công", created);
    }

    @PreAuthorize("hasRole('ORGANIZER')")
    @GetMapping("/{id}")
    public ResponseData<ShowingTimeAdmin> getShowingTime(@PathVariable int id) {
        ShowingTimeAdmin resp = showingTimeService.getShowingTimeById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Suất chiếu không tồn tại"));
        return new ResponseData<>(200, "OK", resp);
    }







}
