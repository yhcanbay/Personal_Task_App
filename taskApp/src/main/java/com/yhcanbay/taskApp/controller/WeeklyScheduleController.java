package com.yhcanbay.taskApp.controller;

import com.yhcanbay.taskApp.dto.WeeklyScheduleDto;
import com.yhcanbay.taskApp.service.WeeklyScheduleService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/schedules/weekly")
public class WeeklyScheduleController {

	private final WeeklyScheduleService weeklyScheduleService;

	public WeeklyScheduleController(WeeklyScheduleService weeklyScheduleService) {
		this.weeklyScheduleService = weeklyScheduleService;
	}

	@GetMapping
	public WeeklyScheduleDto getWeeklySchedule() {
		return weeklyScheduleService.getWeeklySchedule();
	}

	@PutMapping
	public WeeklyScheduleDto saveWeeklySchedule(@RequestBody WeeklyScheduleDto weeklyScheduleDto) {
		return weeklyScheduleService.save(weeklyScheduleDto);
	}
}
