package com.yhcanbay.taskApp.controller;

import com.yhcanbay.taskApp.dto.SettingsDto;
import com.yhcanbay.taskApp.service.SettingsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/settings")
public class SettingsController {

	private final SettingsService settingsService;

	public SettingsController(SettingsService settingsService) {
		this.settingsService = settingsService;
	}

	@GetMapping
	public SettingsDto getSettings() {
		return settingsService.getSettings();
	}

	@PutMapping
	public SettingsDto saveSettings(@RequestBody SettingsDto settingsDto) {
		return settingsService.save(settingsDto);
	}
}
