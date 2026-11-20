Tenho um campo de data e hora, preciso alterar o campo para que aceite somente um intervalo de tempo:
1. Preciso que a lista respeito o intervalo de tempo e os dias uteis, traga somente o necessario para dias uteis e sabado, náo perfirma selecionar nada no domingo, que respeite hra_inicio e hra_fim.

Se tiver alguma duvida antes de gerar algum código me pergunte.

O intervalor de tempo e salvo no banco de dados na tabela tab_parametrizacao:
```sql
CREATE TABLE `tab_parametrizacao` (
  `id` int NOT NULL AUTO_INCREMENT,
  `des_tipo_dia` enum('UTIL','SABADO') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'UTIL',
  `hra_inicio` time NOT NULL,
  `hra_fim` time NOT NULL,
  `qtd_minutos_intervalo` smallint unsigned NOT NULL DEFAULT '0',
  `ind_ativo` tinyint(1) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_param_dia_ativo` (`des_tipo_dia`,`ind_ativo`,`deleted_at`)
) ENGINE=InnoDB
```
```json
{
    "sucesso": true,
    "parametro": 2,
    "dados": [
        {
            "id": 1,
            "des_tipo_dia": "UTIL",
            "hra_inicio": "08:00:00",
            "hra_fim": "17:00:00",
            "qtd_minutos_intervalo": 30,
            "ind_ativo": 1,
            "created_at": "2026-07-12T17:49:11.000Z",
            "updated_at": "2026-11-10T03:32:04.000Z",
            "deleted_at": null
        },
        {
            "id": 2,
            "des_tipo_dia": "SABADO",
            "hra_inicio": "08:00:00",
            "hra_fim": "11:00:00",
            "qtd_minutos_intervalo": 30,
            "ind_ativo": 1,
            "created_at": "2026-07-12T17:51:32.000Z",
            "updated_at": "2026-11-10T03:32:04.000Z",
            "deleted_at": null
        }
    ]
}
```
Trecho do código que gera o valor do horário:
```tsx
<Campo label="Data e hora" erro={errors.dta_agendamento?.message}>
    <Controller
        control={control}
        name="dta_agendamento"
        render={({ field }) => (
            <Input
                type="datetime-local"
                step={1800} // passos de 30 min, igual à duração do slot
                value={paraInput(field.value)}
                onChange={(e) => field.onChange(daInput(e.target.value))}
            />
        )}
    />
</Campo>
```

_______

1. *Formato do campo*: datetime-local não deixa restringir dias nem horas. Posso trocar por um campo de data (com domingo bloqueado) + um Select de horários gerados a partir de hra_inicio, hra_fim e qtd_minutos_intervalo.
2. *Último horário*: com 08:00–17:00 e 30 min, o último horário selecionável é 16:30, porque termina às 17:00. No sábado (08:00–11:00) seria 10:30.
3. *qtd_minutos_intervalo*: é a duração do slot (o que hoje você tem fixo em step={1800}) ou é um intervalo de descanso entre atendimentos, intervalo de descanso entre atendimento.
4. *Horários já ocupados*: devo também esconder ou desabilitar os horários já agendados para a costureira escolhida.
5. *Dia atual*: deve ocultar horários que já passaram quando a data escolhida for hoje.
6. *Parâmetro com ind_ativo = 0*: esse tipo de dia deve ficar totalmente bloqueado.
7. *Edição*: se um agendamento antigo estiver fora do horário parametrizado, mantenho o valor original visível e só valido se o usuário mudar a data.
8. *Agenda (Syncfusion)*: quer que eu restrinja também o scheduler, com domingo oculto e startHour/endHour por dia
9. *Feriados*: ignorar por enquanto?
10. *Permissão*: o endpoint /api/sistema/parametrizacao/ pode ser chamado por qualquer usuário que agende. Wsar o hook useHorarios existente.