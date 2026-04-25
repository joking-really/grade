# Security Specification - PaperCheck Pro

## Data Invariants
1. A submission must belong to a valid evaluationId and studentId.
2. A submission's totalScore must be computed from per-question scores.
3. Only the teacher who created a class, rubric, or evaluation can view/edit it.
4. Evaluations must have a status from the allowed enum.

## The Dirty Dozen Payloads
1. Attempt to create a class with a different `teacherId`.
2. Attempt to update a submission's `totalScore` arbitrarily without updating per-question scores (if enforced by rules, though usually enforced by app logic).
3. Attempt to read rubrics of another teacher.
4. Attempt to delete a class owned by another teacher.
5. Attempt to create a submission for an evaluation that doesn't exist.
6. Attempt to set `isAdmin: true` on teacher profile (resource poisoning).
7. Attempt to inject 1MB string into `studentName`.
8. Attempt to list all evaluations without filtering by `teacherId`.
9. Attempt to update a "Completed" evaluation to "Needs Review" after it's been finalized (Terminal State Lock).
10. Attempt to spoof `email_verified` as false but still access data.
11. Attempt to create a rubric with more than 100 criteria (Denial of Wallet).
12. Attempt to read PII (email) of another teacher.

## Security Roles
- **Teacher**: Owner of classes, rubrics, and evaluations.
- **Admin**: System level access (not implemented yet, but role mapping is ready).

## Relationships
- `Class` -> `Teacher` (ownerId)
- `Student` -> `Class`
- `Rubric` -> `Teacher`
- `Evaluation` -> `Teacher`, `Class`, `Rubric`
- `Submission` -> `Evaluation`, `Student`
