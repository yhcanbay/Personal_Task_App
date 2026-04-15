package com.yhcanbay.taskApp.dto;

public record ScheduleSlotDto(
		String id,
		String timeSlotId,
		String type,
		String start,
		String end,
		Integer index,
		String subjectId,
		String note
) {
}
