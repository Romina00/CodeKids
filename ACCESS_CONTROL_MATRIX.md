# CodeKids role and access matrix

Owner status: confirmed on 2026-07-15. This matrix is the authorization policy for the implemented HTTP surface.

Legend: `✓/status` means allowed with the expected success status, `403` means authenticated but forbidden, `401` means a bearer access token is required, and `Public` means no bearer token is required. Validation and domain failures may additionally return the documented 4xx status.

| Method | Route                                   |     Parent |        Kid |      Admin | Unauthenticated |
| ------ | --------------------------------------- | ---------: | ---------: | ---------: | --------------: |
| POST   | `/auth/register-parent`                 | Public/201 | Public/201 | Public/201 |      Public/201 |
| POST   | `/auth/login`                           | Public/200 | Public/200 | Public/200 |      Public/200 |
| POST   | `/auth/refresh`                         | Public/200 | Public/200 | Public/200 |      Public/200 |
| POST   | `/auth/kid-request`                     | Public/201 | Public/201 | Public/201 |      Public/201 |
| POST   | `/auth/logout`                          |      ✓/200 |      ✓/200 |      ✓/200 |             401 |
| GET    | `/auth/me`                              |      ✓/200 |      ✓/200 |      ✓/200 |             401 |
| POST   | `/auth/parent-mode`                     |        403 |      ✓/200 |        403 |             401 |
| GET    | `/parents/dashboard`                    |      ✓/200 |        403 |        403 |             401 |
| GET    | `/parents/children`                     |      ✓/200 |        403 |        403 |             401 |
| POST   | `/parents/children`                     |      ✓/201 |        403 |        403 |             401 |
| PATCH  | `/parents/children/{childId}`           |      ✓/200 |        403 |        403 |             401 |
| POST   | `/parents/children/{childId}/kids-mode` |      ✓/201 |        403 |        403 |             401 |
| PATCH  | `/parents/account/profile`              |      ✓/200 |        403 |        403 |             401 |
| PATCH  | `/parents/account/password`             |      ✓/200 |        403 |        403 |             401 |
| GET    | `/admin`                                |        403 |        403 |      ✓/200 |             401 |
| GET    | `/users`                                |        403 |        403 |      ✓/200 |             401 |
| POST   | `/learning/levels`                      |        403 |        403 |      ✓/201 |             401 |
| PATCH  | `/learning/progress`                    |        403 |      ✓/200 |        403 |             401 |
| POST   | `/learning/quiz/submit`                 |        403 |      ✓/200 |        403 |             401 |
| GET    | `/learning/rewards`                     |        403 |      ✓/200 |        403 |             401 |
| GET    | `/upload/avatars/defaults`              |      ✓/200 |        403 |        403 |             401 |
| POST   | `/upload/avatars`                       |      ✓/201 |        403 |        403 |             401 |
| DELETE | `/upload/avatars/{fileName}`            |      ✓/200 |        403 |        403 |             401 |

## Policy notes

- Public refresh means the refresh token in the request body is the credential; it does not mean an anonymous session can be created.
- Kids Mode receives a KID access token. It cannot enter Parent or Admin routes, and `/auth/parent-mode` requires the parent password before issuing a Parent token.
- Administrators do not implicitly inherit Parent operations. This prevents support/admin sessions from accessing family-scoped data without an explicit future policy change.
- Avatar operations are Parent-only because parents own child profile configuration. Learning progress, quizzes, and rewards are KID-only; level authoring is Admin-only.
- Any new route must be added to this matrix and to the OpenAPI route-contract test before release.
