| table_name     | ordinal_position | column_name       | data_type                | is_nullable | column_default    |
| -------------- | ---------------- | ----------------- | ------------------------ | ----------- | ----------------- |
| check_ins      | 1                | id                | uuid                     | NO          | gen_random_uuid() |
| check_ins      | 2                | target_id         | uuid                     | NO          | null              |
| check_ins      | 3                | user_id           | uuid                     | NO          | null              |
| check_ins      | 4                | period_key        | text                     | NO          | null              |
| check_ins      | 5                | note              | text                     | YES         | null              |
| check_ins      | 6                | completed_at      | timestamp with time zone | NO          | now()             |
| challenge_check_ins | 1           | id                | uuid                     | NO          | gen_random_uuid() |
| challenge_check_ins | 2           | challenge_id       | uuid                     | NO          | null              |
| challenge_check_ins | 3           | challenge_target_id | uuid                    | NO          | null              |
| challenge_check_ins | 4           | user_id            | uuid                     | NO          | null              |
| challenge_check_ins | 5           | date               | date                     | NO          | null              |
| challenge_check_ins | 6           | note               | text                     | YES         | null              |
| challenge_check_ins | 7           | created_at         | timestamp with time zone | NO          | now()             |
| challenge_members | 1            | challenge_id       | uuid                     | NO          | null              |
| challenge_members | 2            | user_id            | uuid                     | NO          | null              |
| challenge_members | 3            | joined_at          | timestamp with time zone | NO          | now()             |
| challenge_messages | 1           | id                 | uuid                     | NO          | gen_random_uuid() |
| challenge_messages | 2           | challenge_id       | uuid                     | NO          | null              |
| challenge_messages | 3           | user_id            | uuid                     | NO          | null              |
| challenge_messages | 4           | body               | text                     | NO          | null              |
| challenge_messages | 5           | created_at         | timestamp with time zone | NO          | now()             |
| challenge_targets | 1            | id                 | uuid                     | NO          | gen_random_uuid() |
| challenge_targets | 2            | challenge_id       | uuid                     | NO          | null              |
| challenge_targets | 3            | title              | text                     | NO          | null              |
| challenge_targets | 4            | sort_order         | integer                  | NO          | 0                 |
| challenge_targets | 5            | created_at         | timestamp with time zone | NO          | now()             |
| challenges     | 1                | id                | uuid                     | NO          | gen_random_uuid() |
| challenges     | 2                | creator_id        | uuid                     | NO          | null              |
| challenges     | 3                | title             | text                     | NO          | null              |
| challenges     | 4                | header_image_url  | text                     | YES         | null              |
| challenges     | 5                | start_date        | date                     | NO          | null              |
| challenges     | 6                | end_date          | date                     | NO          | null              |
| challenges     | 7                | created_at        | timestamp with time zone | NO          | now()             |
| diet_items     | 1                | id                | uuid                     | NO          | gen_random_uuid() |
| diet_items     | 2                | user_id           | uuid                     | NO          | null              |
| diet_items     | 3                | date              | date                     | NO          | null              |
| diet_items     | 4                | section           | text                     | NO          | null              |
| diet_items     | 5                | text              | text                     | NO          | ''::text          |
| diet_items     | 6                | created_at        | timestamp with time zone | NO          | now()             |
| diet_items     | 7                | protein           | numeric                  | YES         | null              |
| friendships    | 1                | id                | uuid                     | NO          | gen_random_uuid() |
| friendships    | 2                | requester_id      | uuid                     | NO          | null              |
| friendships    | 3                | addressee_id      | uuid                     | NO          | null              |
| friendships    | 4                | status            | text                     | NO          | 'pending'::text   |
| friendships    | 5                | created_at        | timestamp with time zone | NO          | now()             |
| profiles       | 1                | id                | uuid                     | NO          | null              |
| profiles       | 2                | username          | text                     | NO          | null              |
| profiles       | 3                | display_name      | text                     | NO          | null              |
| profiles       | 4                | avatar_url        | text                     | YES         | null              |
| profiles       | 5                | bio               | text                     | YES         | null              |
| profiles       | 6                | pinned_target_ids | ARRAY                    | NO          | '{}'::uuid[]      |
| profiles       | 7                | created_at        | timestamp with time zone | NO          | now()             |
| profiles       | 8                | onboarded         | boolean                  | NO          | true              |
| targets        | 1                | id                | uuid                     | NO          | gen_random_uuid() |
| targets        | 2                | user_id           | uuid                     | NO          | null              |
| targets        | 3                | title             | text                     | NO          | null              |
| targets        | 4                | emoji             | text                     | NO          | '🎯'::text        |
| targets        | 5                | frequency         | text                     | NO          | null              |
| targets        | 6                | weekly_goal       | integer                  | YES         | null              |
| targets        | 7                | color_hex         | text                     | NO          | '#b3813f'::text   |
| targets        | 8                | archived          | boolean                  | NO          | false             |
| targets        | 9                | created_at        | timestamp with time zone | NO          | now()             |
| weight_entries | 1                | id                | uuid                     | NO          | gen_random_uuid() |
| weight_entries | 2                | user_id           | uuid                     | NO          | null              |
| weight_entries | 3                | date              | date                     | NO          | null              |
| weight_entries | 4                | weight            | numeric                  | NO          | null              |
| weight_entries | 5                | created_at        | timestamp with time zone | NO          | now()             |
