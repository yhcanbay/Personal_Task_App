package com.yhcanbay.taskApp.dto;

import java.util.List;

public record SettingsDto(
		List<AvailabilityDto> availability,
		Integer divisionCount,
		Integer slotDuration,
		Integer breakDuration,
		String theme,
		List<SubjectDto> subjects
) {
}
