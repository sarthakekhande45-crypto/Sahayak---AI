# Sahayak Firestore Security Specification

## 1. Data Invariants
1. **Zero Raw Journal Storage**: Raw personal journal text and private AI Companion conversations are cryptographically isolated on the client/session and MUST NEVER be written to Firestore collections or accessible by mentors.
2. **Approved Summaries Only**: `wellness_summaries` records require explicit student approval (`sharingConsent: true`) and contain only abstracted themes and sanitized summaries.
3. **Identity & Pseudonym Integrity**: Mentors view students via `anonymousId` unless explicit `identitySharingConsent` is granted.
4. **No Unrestricted Access**: Anonymous demo role toggling in the client UI does NOT grant raw database admin rights. Rules enforce structural validation, string length constraints, and schema conformance.
5. **Bounded Payloads**: All strings are capped (`<= 1000` chars) and arrays bounded to prevent Denial of Wallet resource attacks.

## 2. The Dirty Dozen Payloads (Security Attack Vectors)
1. **Raw Journal Injection Attack**: Attempting to inject raw un-redacted diary text into `wellness_summaries`.
2. **Ghost Field Poisoning**: Inserting unauthorized administrative fields (`isAdmin: true`, `bypassConsent: true`) into `StudentProfile`.
3. **Oversized String Flood**: Sending a 500KB note in `MoodCheckIn` to trigger document quota exhaustion.
4. **Negative or Out-of-Bounds Score**: Attempting to submit a moodScore of `-99` or `100` (valid range: 1 to 5).
5. **Unauthorized Summary Sharing**: Submitting a `wellness_summaries` entry with `sharingConsent: false` while targeting mentor consumption.
6. **Path Traversal / Malicious ID**: Using `../admins/secret` as document ID.
7. **Read Blanket Scraping**: Attempting an unrestricted collection read without proper schema filters.
8. **Mentor Message Forgery**: Forging sender `mentorId` or impersonating another student in message reply.
9. **Student ID Spoofing**: Submitting mood logs with mismatched `studentId`.
10. **Array Explosion Attack**: Injecting a 10,000-element `emotions` array to abuse Firestore serialization limits.
11. **Timestamp Tampering**: Injecting future or manipulated timestamps instead of ISO string format.
12. **Immutable Field Mutability**: Attempting to mutate original `studentId` or `createdAt` on an existing check-in.

## 3. Test Runner Invariant Assertions
- All 12 unauthorized payloads must be rejected by security rules or client defensive boundary validation.
- Valid operations on `/mood_checkins`, `/wellness_summaries`, `/mentor_messages`, and `/students` must satisfy strict schema shapes.
