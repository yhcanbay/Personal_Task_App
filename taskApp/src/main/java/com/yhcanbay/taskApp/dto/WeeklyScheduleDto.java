package com.yhcanbay.taskApp.dto;

import java.util.List;

public record WeeklyScheduleDto(
		List<ScheduleSlotDto> monday,
		List<ScheduleSlotDto> tuesday,
		List<ScheduleSlotDto> wednesday,
		List<ScheduleSlotDto> thursday,
		List<ScheduleSlotDto> friday,
		List<ScheduleSlotDto> saturday,
		List<ScheduleSlotDto> sunday
) {
	public static WeeklyScheduleDto empty() {
		return new WeeklyScheduleDto(
				List.of(),
				List.of(),
				List.of(),
				List.of(),
				List.of(),
				List.of(),
				List.of()
		);
	}
}
