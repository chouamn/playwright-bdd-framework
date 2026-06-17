@homepage @ui
Feature: Census Special Census HomePage
  As a Census respondent
  I want to access the Census application home page
  So that I can enter my Census ID and begin the survey

  Background:
    Given User navigates to Census HomePage

  # ───────────────────────────────────────────────────────────────────────────
  # Smoke scenarios — fast checks that the page is alive and usable
  # ───────────────────────────────────────────────────────────────────────────

  @smoke
  Scenario: Verify HomePage loads successfully
    Then Welcome heading should be visible
    And Census ID instructions should be visible
    And Help section should be visible

  @smoke
  Scenario: Verify all interactive elements are present and ready
    Then LOGIN button should be enabled
    And All Census ID inputs should be empty
    And Census HomePage should be fully loaded

  # ───────────────────────────────────────────────────────────────────────────
  # Regression scenarios — full workflows
  # ───────────────────────────────────────────────────────────────────────────

  @regression @login
  Scenario: User submits a valid Census ID and proceeds to the next page
    When User enters Census ID "TEST-0001-0001"
    And User clicks LOGIN button
    Then User should be logged in successfully

  @regression @login
  Scenario: User can clear Census ID fields after entering data
    When User enters Census ID "TEST-0001-0001"
    And User clears all Census ID fields
    Then All Census ID inputs should be empty

  @regression @login
  Scenario: User enters Census ID one segment at a time
    When User enters Q7M segment "TEST"
    And User enters FRVR segment "0002"
    And User enters DTCQ segment "0002"
    And User clicks LOGIN button
    Then User should be logged in successfully

  # ───────────────────────────────────────────────────────────────────────────
  # Data-driven scenario — multiple Census IDs from Examples table
  # ───────────────────────────────────────────────────────────────────────────

  @regression @login @data-driven
  Scenario Outline: User submits various valid Census IDs
    When User enters Census ID "<census_id>"
    And User clicks LOGIN button
    Then Submission should be successful

    Examples:
      | census_id      |
      | TEST-0001-0001 |
      | TEST-0002-0002 |
      | TEST-0003-0003 |
