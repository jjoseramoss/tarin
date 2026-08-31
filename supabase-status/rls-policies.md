| schemaname | tablename      | policyname                                | permissive | roles    | cmd    | qual                                                         | with_check                  |
| ---------- | -------------- | ----------------------------------------- | ---------- | -------- | ------ | ------------------------------------------------------------ | --------------------------- |
| public     | check_ins      | Check-ins are viewable by connections     | PERMISSIVE | {public} | SELECT | are_connected(auth.uid(), user_id)                           | null                        |
| public     | check_ins      | Users can delete their own check-ins      | PERMISSIVE | {public} | DELETE | (auth.uid() = user_id)                                       | null                        |
| public     | check_ins      | Users can insert their own check-ins      | PERMISSIVE | {public} | INSERT | null                                                         | (auth.uid() = user_id)      |
| public     | check_ins      | Users can update their own check-ins      | PERMISSIVE | {public} | UPDATE | (auth.uid() = user_id)                                       | null                        |
| public     | challenge_check_ins | Users can delete their own challenge check-ins | PERMISSIVE | {public} | DELETE | ((auth.uid() = user_id) AND is_challenge_member(auth.uid(), challenge_id)) | null                        |
| public     | challenge_check_ins | Users can insert their own challenge check-ins | PERMISSIVE | {public} | INSERT | null                                                    | ((auth.uid() = user_id) AND is_challenge_member(auth.uid(), challenge_id) AND (EXISTS ( SELECT 1
   FROM (public.challenge_targets t
     JOIN public.challenges ch ON ((ch.id = t.challenge_id)))
  WHERE ((t.id = challenge_target_id) AND (t.challenge_id = challenge_id) AND (date >= ch.start_date) AND (date <= ch.end_date))))) |
| public     | challenge_check_ins | Users can update their own challenge check-ins | PERMISSIVE | {public} | UPDATE | (auth.uid() = user_id)                                  | ((auth.uid() = user_id) AND is_challenge_member(auth.uid(), challenge_id) AND (EXISTS ( SELECT 1
   FROM (public.challenge_targets t
     JOIN public.challenges ch ON ((ch.id = t.challenge_id)))
  WHERE ((t.id = challenge_target_id) AND (t.challenge_id = challenge_id) AND (date >= ch.start_date) AND (date <= ch.end_date))))) |
| public     | challenge_check_ins | Users can view their own challenge check-ins   | PERMISSIVE | {public} | SELECT | (auth.uid() = user_id)                                  | null                        |
| public     | challenge_members | Anyone can view challenge members            | PERMISSIVE | {public} | SELECT | true                                                   | null                        |
| public     | challenge_members | Users can join challenges                     | PERMISSIVE | {public} | INSERT | null                                                   | (auth.uid() = user_id)      |
| public     | challenge_members | Users can leave challenges                    | PERMISSIVE | {public} | DELETE | (auth.uid() = user_id)                                  | null                        |
| public     | challenge_messages | Challenge chat is viewable by members       | PERMISSIVE | {public} | SELECT | is_challenge_member(auth.uid(), challenge_id)          | null                        |
| public     | challenge_messages | Members can send messages                    | PERMISSIVE | {public} | INSERT | null                                                   | (auth.uid() = user_id)      |
| public     | challenge_messages | Authors can delete their messages            | PERMISSIVE | {public} | DELETE | (auth.uid() = user_id)                                  | null                        |
| public     | challenges     | Challenges are viewable by everyone          | PERMISSIVE | {public} | SELECT | true                                                   | null                        |
| public     | challenges     | Users can create challenges                   | PERMISSIVE | {public} | INSERT | null                                                   | (auth.uid() = creator_id)   |
| public     | challenges     | Creators can update their challenges          | PERMISSIVE | {public} | UPDATE | (auth.uid() = creator_id)                               | null                        |
| public     | challenges     | Creators can delete their challenges          | PERMISSIVE | {public} | DELETE | (auth.uid() = creator_id)                               | null                        |
| public     | challenge_targets | Challenge targets are viewable by everyone  | PERMISSIVE | {public} | SELECT | true                                                   | null                        |
| public     | challenge_targets | Creators can insert challenge targets       | PERMISSIVE | {public} | INSERT | null                                                  | is_challenge_creator(auth.uid(), challenge_id) |
| public     | challenge_targets | Creators can update challenge targets       | PERMISSIVE | {public} | UPDATE | is_challenge_creator(auth.uid(), challenge_id)         | null                        |
| public     | challenge_targets | Creators can delete challenge targets       | PERMISSIVE | {public} | DELETE | is_challenge_creator(auth.uid(), challenge_id)         | null                        |
| public     | diet_items     | Users can delete their own diet items     | PERMISSIVE | {public} | DELETE | (auth.uid() = user_id)                                       | null                        |
| public     | diet_items     | Users can insert their own diet items     | PERMISSIVE | {public} | INSERT | null                                                         | (auth.uid() = user_id)      |
| public     | diet_items     | Users can update their own diet items     | PERMISSIVE | {public} | UPDATE | (auth.uid() = user_id)                                       | null                        |
| public     | diet_items     | Users can view their own diet items       | PERMISSIVE | {public} | SELECT | (auth.uid() = user_id)                                       | null                        |
| public     | friendships    | Either party can delete a friendship      | PERMISSIVE | {public} | DELETE | ((auth.uid() = requester_id) OR (auth.uid() = addressee_id)) | null                        |
| public     | friendships    | Either party can update a friendship      | PERMISSIVE | {public} | UPDATE | ((auth.uid() = requester_id) OR (auth.uid() = addressee_id)) | null                        |
| public     | friendships    | Users can send friend requests            | PERMISSIVE | {public} | INSERT | null                                                         | (auth.uid() = requester_id) |
| public     | friendships    | Users can view their own friendships      | PERMISSIVE | {public} | SELECT | ((auth.uid() = requester_id) OR (auth.uid() = addressee_id)) | null                        |
| public     | profiles       | Profiles are viewable by everyone         | PERMISSIVE | {public} | SELECT | true                                                         | null                        |
| public     | profiles       | Users can update their own profile        | PERMISSIVE | {public} | UPDATE | (auth.uid() = id)                                            | null                        |
| public     | targets        | Targets are viewable by everyone          | PERMISSIVE | {public} | SELECT | true                                                         | null                        |
| public     | targets        | Users can delete their own targets        | PERMISSIVE | {public} | DELETE | (auth.uid() = user_id)                                       | null                        |
| public     | targets        | Users can insert their own targets        | PERMISSIVE | {public} | INSERT | null                                                         | (auth.uid() = user_id)      |
| public     | targets        | Users can update their own targets        | PERMISSIVE | {public} | UPDATE | (auth.uid() = user_id)                                       | null                        |
| public     | weight_entries | Users can delete their own weight entries | PERMISSIVE | {public} | DELETE | (auth.uid() = user_id)                                       | null                        |
| public     | weight_entries | Users can insert their own weight entries | PERMISSIVE | {public} | INSERT | null                                                         | (auth.uid() = user_id)      |
| public     | weight_entries | Users can update their own weight entries | PERMISSIVE | {public} | UPDATE | (auth.uid() = user_id)                                       | null                        |
| public     | weight_entries | Users can view their own weight entries   | PERMISSIVE | {public} | SELECT | (auth.uid() = user_id)                                       | null                        |
