-- Migração: config de IA por canal.
-- Rode no SQL Editor do Supabase se o banco foi criado antes desta mudança.

-- 1. adiciona a coluna platform (permite nulo temporariamente)
alter table ai_config add column if not exists platform text;

-- 2. herda a config global existente para o WhatsApp (se houver uma linha sem canal)
update ai_config
set platform = 'whatsapp'
where platform is null
  and id = (select id from ai_config where platform is null order by updated_at desc limit 1);

-- 3. garante uma linha para cada canal
insert into ai_config (platform)
select 'whatsapp' where not exists (select 1 from ai_config where platform = 'whatsapp');
insert into ai_config (platform)
select 'instagram' where not exists (select 1 from ai_config where platform = 'instagram');

-- 4. remove eventuais linhas antigas sem canal
delete from ai_config where platform is null;

-- 5. trava a coluna: obrigatória, única e restrita aos canais válidos
alter table ai_config alter column platform set not null;
create unique index if not exists ai_config_platform_key on ai_config (platform);

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'ai_config_platform_check'
  ) then
    alter table ai_config
      add constraint ai_config_platform_check check (platform in ('whatsapp','instagram'));
  end if;
end $$;
