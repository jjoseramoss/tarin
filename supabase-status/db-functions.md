| pg_get_functiondef                                                                                                                                                                                                                                                                                                                                                                                              |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CREATE OR REPLACE FUNCTION public.are_connected(user_a uuid, user_b uuid)
  RETURNS boolean
  LANGUAGE sql
  STABLE SECURITY DEFINER
  SET search_path TO 'public'
AS $function$
  select
    user_a = user_b
    or exists (
      select 1
      from public.friendships f
      where f.status = 'accepted'
        and (
          (f.requester_id = user_a and f.addressee_id = user_b)
          or (f.requester_id = user_b and f.addressee_id = user_a)
        )
    );
$function$
  |
| CREATE OR REPLACE FUNCTION public.is_challenge_member(p_user_id uuid, p_challenge_id uuid)
  RETURNS boolean
  LANGUAGE sql
  STABLE SECURITY DEFINER
  SET search_path TO 'public'
AS $function$
  select exists (
    select 1
    from public.challenge_members m
    where m.challenge_id = p_challenge_id
      and m.user_id = p_user_id
  );
$function$
  |
| CREATE OR REPLACE FUNCTION public.is_challenge_creator(p_user_id uuid, p_challenge_id uuid)
  RETURNS boolean
  LANGUAGE sql
  STABLE SECURITY DEFINER
  SET search_path TO 'public'
AS $function$
  select exists (
    select 1
    from public.challenges c
    where c.id = p_challenge_id
      and c.creator_id = p_user_id
  );
$function$
  |
| CREATE OR REPLACE FUNCTION public.challenge_leaderboard(p_challenge_id uuid)
  RETURNS TABLE(user_id uuid, display_name text, avatar_url text, completed_count bigint)
  LANGUAGE plpgsql
  STABLE SECURITY DEFINER
  SET search_path TO 'public'
AS $function$
begin
  if not public.is_challenge_member(auth.uid(), p_challenge_id) then
    return;
  end if;

  return query
  select
    cci.user_id,
    p.display_name,
    p.avatar_url,
    count(*)::bigint as completed_count
  from public.challenge_check_ins cci
  join public.challenges ch on ch.id = cci.challenge_id
  join public.profiles p on p.id = cci.user_id
  where cci.challenge_id = p_challenge_id
    and cci.date between ch.start_date and ch.end_date
  group by cci.user_id, p.display_name, p.avatar_url
  order by completed_count desc, cci.user_id asc;
end;
$function$
  |
