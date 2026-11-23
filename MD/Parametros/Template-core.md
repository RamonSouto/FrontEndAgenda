Preciso que se comporte como uma, engenheiro de software sênior, arquiteto de software sênior e desenvolvedor frontend sênior. Preciso implementar uma feature dos layout de Templates em um projeto Next.js V16.2.10 com React Query e um cliente HTTP customizado no layout estou utilizado Shadcn V4.16.0, para icones estou utilizando lucide-react V1.24.0, vou utilizar a biblioteca reactjs-tiptap-editor(https://reactjs-tiptap-editor.vercel.app/). Estou trabalhando nos tamanhos de tela Mobile First, MD - medium e LG - larguer.Os requisitos são:

* **Endpoints da API**:
  * Cadastrar e Editar  Template
    * **Método HTTP**: PUT
    * **URL**: /api/sistema/empresa/{id}/email-templates/{evento}
    * **Campos**: id, id_empresa, ind_evento, des_assunto, des_corpo_html, ind_ativo, id_usuario_alteracao, created_at, updated_at
    * **Autenticação**: já existe httpClient com token via cookie.
    * **Cache**: staleTime de 5 minutos.
    * **Chaves**: templateEmailKeys.
    * **Validação**: schema com os mesmos campos
    * **Estrutura de dados (enviado)**:
    ```json
    {
        "des_assunto": "Agendamento Concluido",
        "des_corpo_html": "<!DOCTYPE html><html><body style='margin:0; padding:0; background-color:#f4f1f7;'><!-- Pré-visualização --><div style='display:none; font-size:1px; color:#f4f1f7; line-height:1px; max-height:0; max-width:0; opacity:0; overflow:hidden;'>Seu agendamento com {{nome_costureira}} foi confirmado para {{data_agendamento}} às {{hora_agendamento}}.&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div><table role='presentation' width='100%' cellspacing='0' cellpadding='0' border='0' style='background-color:#f4f1f7;'><tr><td align='center' style='padding:32px 12px;'><table role='presentation' width='600' cellspacing='0' cellpadding='0' border='0' style='width:100%; max-width:600px; background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.06);'><!-- Cabeçalho --><tr><td align='center' style='background-color:#6b4c8a; padding:36px 24px;'><div style='font-family:Georgia, 'Times New Roman', serif; font-size:14px; letter-spacing:2px; text-transform:uppercase; color:#e6d9f2; margin:0 0 8px 0;'>{{nome_empresa}}</div><h1 style='font-family:Georgia, 'Times New Roman', serif; font-size:26px; line-height:34px; font-weight:normal; color:#ffffff; margin:0;'>Agendamento confirmado!</h1></td></tr><!-- Ícone --><tr><td align='center' style='padding:32px 24px 0 24px;'><table role='presentation' cellspacing='0' cellpadding='0' border='0'><tr><td align='center' width='64' height='64' style='background-color:#e8f5ec; border-radius:50%; font-family:Arial, Helvetica, sans-serif; font-size:30px; line-height:64px; color:#2e8b57;'>&#10003;</td></tr></table></td></tr><!-- Saudação --><tr><td style='padding:24px 40px 0 40px; font-family:Arial, Helvetica, sans-serif; font-size:16px; line-height:26px; color:#3d3d3d;'><p style='margin:0 0 12px 0;'>Olá, <strong>{{nome_cliente}}</strong>!</p><p style='margin:0;'>Seu agendamento foi confirmado com sucesso. Estamos felizes em atender você. Confira abaixo os detalhes:</p></td></tr><!-- Detalhes --><tr><td style='padding:24px 40px 0 40px;'><table role='presentation' width='100%' cellspacing='0' cellpadding='0' border='0' style='background-color:#faf7fd; border:1px solid #e8e0f2; border-radius:10px;'><tr><td style='padding:24px 24px 8px 24px;'><table role='presentation' width='100%' cellspacing='0' cellpadding='0' border='0'><tr><td width='34' valign='top' style='font-family:Arial, Helvetica, sans-serif; font-size:18px; line-height:24px; padding-bottom:16px;'>&#128197;</td><td valign='top' style='padding-bottom:16px; font-family:Arial, Helvetica, sans-serif;'><div style='font-size:12px; letter-spacing:1px; text-transform:uppercase; color:#8b7fa0; padding-bottom:2px;'>Data</div><div style='font-size:16px; line-height:24px; color:#2b2b2b; font-weight:bold;'>{{data_agendamento}}</div></td></tr></table><table role='presentation' width='100%' cellspacing='0' cellpadding='0' border='0'><tr><td width='34' valign='top' style='font-family:Arial, Helvetica, sans-serif; font-size:18px; line-height:24px; padding-bottom:16px;'>&#128336;</td><td valign='top' style='padding-bottom:16px; font-family:Arial, Helvetica, sans-serif;'><div style='font-size:12px; letter-spacing:1px; text-transform:uppercase; color:#8b7fa0; padding-bottom:2px;'>Horário</div><div style='font-size:16px; line-height:24px; color:#2b2b2b; font-weight:bold;'>{{hora_agendamento}}</div></td></tr></table><table role='presentation' width='100%' cellspacing='0' cellpadding='0' border='0'><tr><td width='34' valign='top' style='font-family:Arial, Helvetica, sans-serif; font-size:18px; line-height:24px; padding-bottom:16px;'>&#129525;</td><td valign='top' style='padding-bottom:16px; font-family:Arial, Helvetica, sans-serif;'><div style='font-size:12px; letter-spacing:1px; text-transform:uppercase; color:#8b7fa0; padding-bottom:2px;'>Profissional</div><div style='font-size:16px; line-height:24px; color:#2b2b2b; font-weight:bold;'>{{nome_costureira}}</div></td></tr></table><table role='presentation' width='100%' cellspacing='0' cellpadding='0' border='0'><tr><td width='34' valign='top' style='font-family:Arial, Helvetica, sans-serif; font-size:18px; line-height:24px; padding-bottom:8px;'>&#127970;</td><td valign='top' style='padding-bottom:8px; font-family:Arial, Helvetica, sans-serif;'><div style='font-size:12px; letter-spacing:1px; text-transform:uppercase; color:#8b7fa0; padding-bottom:2px;'>Local</div><div style='font-size:16px; line-height:24px; color:#2b2b2b; font-weight:bold;'>{{nome_empresa}}</div></td></tr></table></td></tr></table></td></tr><!-- Botão --><tr><td align='center' style='padding:28px 40px 8px 40px;'><table role='presentation' cellspacing='0' cellpadding='0' border='0' width='100%'><tr><td align='center' style='border-radius:8px; background-color:#6b4c8a;'><a href='{{link_acompanhamento}}' style='display:inline-block; width:100%; padding:16px 24px; box-sizing:border-box; font-family:Arial, Helvetica, sans-serif; font-size:16px; font-weight:bold; line-height:20px; color:#ffffff; text-decoration:none; border-radius:8px; background-color:#6b4c8a;'> Acompanhar meu agendamento</a></td></tr></table></td></tr><!-- Link alternativo --><tr><td align='center' style='padding:4px 40px 0 40px; font-family:Arial, Helvetica, sans-serif; font-size:13px; line-height:20px; color:#8b7fa0;'>Se o botão não funcionar, copie e cole este link no seu navegador:<br><a href='{{link_acompanhamento}}' style='color:#6b4c8a; word-break:break-all;'>{{link_acompanhamento}}</a></td></tr><!-- Aviso --><tr><td style='padding:24px 40px 0 40px;'><p style='margin:0; font-family:Arial, Helvetica, sans-serif; font-size:14px; line-height:22px; color:#6b6b6b;'>Precisa remarcar ou cancelar? Entre em contato com a gente pelo telefone<a href='tel:{{telefone_empresa}}' style='color:#6b4c8a; font-weight:bold; text-decoration:none;'>{{telefone_empresa}}</a>com pelo menos 24 horas de antecedência.</p></td></tr><!-- Divisor --><tr><td style='padding:32px 24px 0 24px;'><table role='presentation' width='100%' cellspacing='0' cellpadding='0' border='0'><tr><td style='border-top:1px solid #ece6f3; font-size:0; line-height:0;'>&nbsp;</td></tr></table></td></tr><!-- Rodapé --><tr><td align='center' style='padding:24px 24px 36px 24px; font-family:Arial, Helvetica, sans-serif;'><p style='margin:0 0 6px 0; font-size:15px; line-height:22px; color:#3d3d3d; font-weight:bold;'>{{nome_empresa}}</p><p style='margin:0; font-size:13px; line-height:20px; color:#8b7fa0;'>Telefone: {{telefone_empresa}}</p><p style='margin:16px 0 0 0; font-size:12px; line-height:18px; color:#a99fb8;'>Este é um e-mail automático, não responda a esta mensagem.</p></td></tr></table></td></tr></table></body></html>",
        "ind_ativo": true
    }
    ```
    * **Estrutura de dados (resposta)**:
    ```json
    {
        "sucesso": true,
        "mensagem": "Registro atualizado com sucesso",
        "dados": {
            "id": 4,
            "id_empresa": 1,
            "ind_evento": "agendamento_concluido",
            "des_assunto": "Agendamento Concluido",
            "des_corpo_html": "<div style=\"font-size:1px;color:#f4f1f7\">Seu agendamento com {{nome_costureira}} foi confirmado para {{data_agendamento}} às {{hora_agendamento}}. ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌</div><table style=\"background-color:#f4f1f7\"><tr><td align=\"center\" style=\"padding:32px 12px\"><table style=\"background-color:#ffffff\"><tr><td align=\"center\" style=\"background-color:#6b4c8a;padding:36px 24px\"><div>{{nome_empresa}}</div><h1>Agendamento confirmado!</h1></td></tr><tr><td align=\"center\" style=\"padding:32px 24px 0 24px\"><table><tr><td align=\"center\" style=\"background-color:#e8f5ec;font-size:30px;color:#2e8b57\">✓</td></tr></table></td></tr><tr><td style=\"padding:24px 40px 0 40px;font-size:16px;color:#3d3d3d\"><p style=\"margin:0 0 12px 0\">Olá, <strong>{{nome_cliente}}</strong>!</p><p style=\"margin:0\">Seu agendamento foi confirmado com sucesso. Estamos felizes em atender você. Confira abaixo os detalhes:</p></td></tr><tr><td style=\"padding:24px 40px 0 40px\"><table style=\"background-color:#faf7fd\"><tr><td style=\"padding:24px 24px 8px 24px\"><table><tr><td style=\"font-size:18px\">📅</td><td><div style=\"font-size:12px;color:#8b7fa0\">Data</div><div style=\"font-size:16px;color:#2b2b2b;font-weight:bold\">{{data_agendamento}}</div></td></tr></table><table><tr><td style=\"font-size:18px\">🕐</td><td><div style=\"font-size:12px;color:#8b7fa0\">Horário</div><div style=\"font-size:16px;color:#2b2b2b;font-weight:bold\">{{hora_agendamento}}</div></td></tr></table><table><tr><td style=\"font-size:18px\">🧵</td><td><div style=\"font-size:12px;color:#8b7fa0\">Profissional</div><div style=\"font-size:16px;color:#2b2b2b;font-weight:bold\">{{nome_costureira}}</div></td></tr></table><table><tr><td style=\"font-size:18px\">🏢</td><td><div style=\"font-size:12px;color:#8b7fa0\">Local</div><div style=\"font-size:16px;color:#2b2b2b;font-weight:bold\">{{nome_empresa}}</div></td></tr></table></td></tr></table></td></tr><tr><td align=\"center\" style=\"padding:28px 40px 8px 40px\"><table><tr><td align=\"center\" style=\"background-color:#6b4c8a\"><a href=\"{{link_acompanhamento}}\" style=\"padding:16px 24px;font-size:16px;font-weight:bold;color:#ffffff;background-color:#6b4c8a\"> Acompanhar meu agendamento</a></td></tr></table></td></tr><tr><td align=\"center\" style=\"padding:4px 40px 0 40px;font-size:13px;color:#8b7fa0\">Se o botão não funcionar, copie e cole este link no seu navegador:<br /><a href=\"{{link_acompanhamento}}\" style=\"color:#6b4c8a\">{{link_acompanhamento}}</a></td></tr><tr><td style=\"padding:24px 40px 0 40px\"><p style=\"margin:0;font-size:14px;color:#6b6b6b\">Precisa remarcar ou cancelar? Entre em contato com a gente pelo telefone<a style=\"color:#6b4c8a;font-weight:bold\">{{telefone_empresa}}</a>com pelo menos 24 horas de antecedência.</p></td></tr><tr><td style=\"padding:32px 24px 0 24px\"><table><tr><td> </td></tr></table></td></tr><tr><td align=\"center\" style=\"padding:24px 24px 36px 24px\"><p style=\"margin:0 0 6px 0;font-size:15px;color:#3d3d3d;font-weight:bold\">{{nome_empresa}}</p><p style=\"margin:0;font-size:13px;color:#8b7fa0\">Telefone: {{telefone_empresa}}</p><p style=\"margin:16px 0 0 0;font-size:12px;color:#a99fb8\">Este é um e-mail automático, não responda a esta mensagem.</p></td></tr></table></td></tr></table>",
            "ind_ativo": 1,
            "updated_at": "2026-11-22T04:54:22.000Z"
        }
    }
    ```
  * Listar Template:
    * **Método HTTP**: GET
    * **URL**: /api/sistema/empresa/{id}/email-templates
    * **Campos**: id, id_empresa, ind_evento, des_assunto, des_corpo_html, ind_ativo, id_usuario_alteracao, created_at, updated_at
    * **Autenticação**: já existe httpClient com token via cookie.
    * **Cache**: staleTime de 5 minutos.
    * **Chaves**: templateEmailKeys.
    * **Validação**: schema com os mesmos campos
    * **Estrutura de dados (resposta)**:
    ```json
    {
        "sucesso": true,
        "dados": {
            "templates": [
                {
                    "id": 1,
                    "ind_evento": "agendamento_cadastrado",
                    "des_assunto": "Agendamento Cadastrado",
                    "des_corpo_html": "<div style=\"font-size:1px;color:#f4f1f7\">Seu agendamento com {{nome_costureira}} foi confirmado para {{data_agendamento}} às {{hora_agendamento}}. ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌</div><table style=\"background-color:#f4f1f7\"><tr><td align=\"center\" style=\"padding:32px 12px\"><table style=\"background-color:#ffffff\"><tr><td align=\"center\" style=\"background-color:#6b4c8a;padding:36px 24px\"><div>{{nome_empresa}}</div><h1>Agendamento confirmado!</h1></td></tr><tr><td align=\"center\" style=\"padding:32px 24px 0 24px\"><table><tr><td align=\"center\" style=\"background-color:#e8f5ec;font-size:30px;color:#2e8b57\">✓</td></tr></table></td></tr><tr><td style=\"padding:24px 40px 0 40px;font-size:16px;color:#3d3d3d\"><p style=\"margin:0 0 12px 0\">Olá, <strong>{{nome_cliente}}</strong>!</p><p style=\"margin:0\">Seu agendamento foi confirmado com sucesso. Estamos felizes em atender você. Confira abaixo os detalhes:</p></td></tr><tr><td style=\"padding:24px 40px 0 40px\"><table style=\"background-color:#faf7fd\"><tr><td style=\"padding:24px 24px 8px 24px\"><table><tr><td style=\"font-size:18px\">📅</td><td><div style=\"font-size:12px;color:#8b7fa0\">Data</div><div style=\"font-size:16px;color:#2b2b2b;font-weight:bold\">{{data_agendamento}}</div></td></tr></table><table><tr><td style=\"font-size:18px\">🕐</td><td><div style=\"font-size:12px;color:#8b7fa0\">Horário</div><div style=\"font-size:16px;color:#2b2b2b;font-weight:bold\">{{hora_agendamento}}</div></td></tr></table><table><tr><td style=\"font-size:18px\">🧵</td><td><div style=\"font-size:12px;color:#8b7fa0\">Profissional</div><div style=\"font-size:16px;color:#2b2b2b;font-weight:bold\">{{nome_costureira}}</div></td></tr></table><table><tr><td style=\"font-size:18px\">🏢</td><td><div style=\"font-size:12px;color:#8b7fa0\">Local</div><div style=\"font-size:16px;color:#2b2b2b;font-weight:bold\">{{nome_empresa}}</div></td></tr></table></td></tr></table></td></tr><tr><td align=\"center\" style=\"padding:28px 40px 8px 40px\"><table><tr><td align=\"center\" style=\"background-color:#6b4c8a\"><a href=\"{{link_acompanhamento}}\" style=\"padding:16px 24px;font-size:16px;font-weight:bold;color:#ffffff;background-color:#6b4c8a\"> Acompanhar meu agendamento</a></td></tr></table></td></tr><tr><td align=\"center\" style=\"padding:4px 40px 0 40px;font-size:13px;color:#8b7fa0\">Se o botão não funcionar, copie e cole este link no seu navegador:<br /><a href=\"{{link_acompanhamento}}\" style=\"color:#6b4c8a\">{{link_acompanhamento}}</a></td></tr><tr><td style=\"padding:24px 40px 0 40px\"><p style=\"margin:0;font-size:14px;color:#6b6b6b\">Precisa remarcar ou cancelar? Entre em contato com a gente pelo telefone<a style=\"color:#6b4c8a;font-weight:bold\">{{telefone_empresa}}</a>com pelo menos 24 horas de antecedência.</p></td></tr><tr><td style=\"padding:32px 24px 0 24px\"><table><tr><td> </td></tr></table></td></tr><tr><td align=\"center\" style=\"padding:24px 24px 36px 24px\"><p style=\"margin:0 0 6px 0;font-size:15px;color:#3d3d3d;font-weight:bold\">{{nome_empresa}}</p><p style=\"margin:0;font-size:13px;color:#8b7fa0\">Telefone: {{telefone_empresa}}</p><p style=\"margin:16px 0 0 0;font-size:12px;color:#a99fb8\">Este é um e-mail automático, não responda a esta mensagem.</p></td></tr></table></td></tr></table>",
                    "ind_ativo": 1,
                    "updated_at": "2026-11-20T00:03:17.000Z"
                },
                {
                    "id": 4,
                    "ind_evento": "agendamento_concluido",
                    "des_assunto": "Agendamento Concluido",
                    "des_corpo_html": "<div style=\"font-size:1px;color:#f4f1f7\">Seu agendamento com {{nome_costureira}} foi confirmado para {{data_agendamento}} às {{hora_agendamento}}. ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌</div><table style=\"background-color:#f4f1f7\"><tr><td align=\"center\" style=\"padding:32px 12px\"><table style=\"background-color:#ffffff\"><tr><td align=\"center\" style=\"background-color:#6b4c8a;padding:36px 24px\"><div>{{nome_empresa}}</div><h1>Agendamento confirmado!</h1></td></tr><tr><td align=\"center\" style=\"padding:32px 24px 0 24px\"><table><tr><td align=\"center\" style=\"background-color:#e8f5ec;font-size:30px;color:#2e8b57\">✓</td></tr></table></td></tr><tr><td style=\"padding:24px 40px 0 40px;font-size:16px;color:#3d3d3d\"><p style=\"margin:0 0 12px 0\">Olá, <strong>{{nome_cliente}}</strong>!</p><p style=\"margin:0\">Seu agendamento foi confirmado com sucesso. Estamos felizes em atender você. Confira abaixo os detalhes:</p></td></tr><tr><td style=\"padding:24px 40px 0 40px\"><table style=\"background-color:#faf7fd\"><tr><td style=\"padding:24px 24px 8px 24px\"><table><tr><td style=\"font-size:18px\">📅</td><td><div style=\"font-size:12px;color:#8b7fa0\">Data</div><div style=\"font-size:16px;color:#2b2b2b;font-weight:bold\">{{data_agendamento}}</div></td></tr></table><table><tr><td style=\"font-size:18px\">🕐</td><td><div style=\"font-size:12px;color:#8b7fa0\">Horário</div><div style=\"font-size:16px;color:#2b2b2b;font-weight:bold\">{{hora_agendamento}}</div></td></tr></table><table><tr><td style=\"font-size:18px\">🧵</td><td><div style=\"font-size:12px;color:#8b7fa0\">Profissional</div><div style=\"font-size:16px;color:#2b2b2b;font-weight:bold\">{{nome_costureira}}</div></td></tr></table><table><tr><td style=\"font-size:18px\">🏢</td><td><div style=\"font-size:12px;color:#8b7fa0\">Local</div><div style=\"font-size:16px;color:#2b2b2b;font-weight:bold\">{{nome_empresa}}</div></td></tr></table></td></tr></table></td></tr><tr><td align=\"center\" style=\"padding:28px 40px 8px 40px\"><table><tr><td align=\"center\" style=\"background-color:#6b4c8a\"><a href=\"{{link_acompanhamento}}\" style=\"padding:16px 24px;font-size:16px;font-weight:bold;color:#ffffff;background-color:#6b4c8a\"> Acompanhar meu agendamento</a></td></tr></table></td></tr><tr><td align=\"center\" style=\"padding:4px 40px 0 40px;font-size:13px;color:#8b7fa0\">Se o botão não funcionar, copie e cole este link no seu navegador:<br /><a href=\"{{link_acompanhamento}}\" style=\"color:#6b4c8a\">{{link_acompanhamento}}</a></td></tr><tr><td style=\"padding:24px 40px 0 40px\"><p style=\"margin:0;font-size:14px;color:#6b6b6b\">Precisa remarcar ou cancelar? Entre em contato com a gente pelo telefone<a style=\"color:#6b4c8a;font-weight:bold\">{{telefone_empresa}}</a>com pelo menos 24 horas de antecedência.</p></td></tr><tr><td style=\"padding:32px 24px 0 24px\"><table><tr><td> </td></tr></table></td></tr><tr><td align=\"center\" style=\"padding:24px 24px 36px 24px\"><p style=\"margin:0 0 6px 0;font-size:15px;color:#3d3d3d;font-weight:bold\">{{nome_empresa}}</p><p style=\"margin:0;font-size:13px;color:#8b7fa0\">Telefone: {{telefone_empresa}}</p><p style=\"margin:16px 0 0 0;font-size:12px;color:#a99fb8\">Este é um e-mail automático, não responda a esta mensagem.</p></td></tr></table></td></tr></table>",
                    "ind_ativo": 1,
                    "updated_at": "2026-11-22T04:54:22.000Z"
                }
            ],
            "placeholders": [
                "nome_cliente",
                "nome_costureira",
                "data_agendamento",
                "hora_agendamento",
                "nome_empresa",
                "telefone_empresa",
                "link_acompanhamento"
            ]
        }
    }
    ```
  * Listar Template por Tipo: 
    * **Método HTTP**: GET
    * **URL**: /api/sistema/empresa/{1}/email-templates/{evento}
    * **Campos**: id, id_empresa, ind_evento, des_assunto, des_corpo_html, ind_ativo, id_usuario_alteracao, created_at, updated_at
    * **Autenticação**: já existe httpClient com token via cookie.
    * **Cache**: staleTime de 5 minutos.
    * **Chaves**: templateEmailKeys.
    * **Validação**: schema com os mesmos campos
    * **Estrutura de dados (resposta)**:
    ```json
    {
        "sucesso": true,
        "dados": {
            "id": 1,
            "id_empresa": 1,
            "ind_evento": "agendamento_cadastrado",
            "des_assunto": "Agendamento Cadastrado",
            "des_corpo_html": "<div style=\"font-size:1px;color:#f4f1f7\">Seu agendamento com {{nome_costureira}} foi confirmado para {{data_agendamento}} às {{hora_agendamento}}. ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌</div><table style=\"background-color:#f4f1f7\"><tr><td align=\"center\" style=\"padding:32px 12px\"><table style=\"background-color:#ffffff\"><tr><td align=\"center\" style=\"background-color:#6b4c8a;padding:36px 24px\"><div>{{nome_empresa}}</div><h1>Agendamento confirmado!</h1></td></tr><tr><td align=\"center\" style=\"padding:32px 24px 0 24px\"><table><tr><td align=\"center\" style=\"background-color:#e8f5ec;font-size:30px;color:#2e8b57\">✓</td></tr></table></td></tr><tr><td style=\"padding:24px 40px 0 40px;font-size:16px;color:#3d3d3d\"><p style=\"margin:0 0 12px 0\">Olá, <strong>{{nome_cliente}}</strong>!</p><p style=\"margin:0\">Seu agendamento foi confirmado com sucesso. Estamos felizes em atender você. Confira abaixo os detalhes:</p></td></tr><tr><td style=\"padding:24px 40px 0 40px\"><table style=\"background-color:#faf7fd\"><tr><td style=\"padding:24px 24px 8px 24px\"><table><tr><td style=\"font-size:18px\">📅</td><td><div style=\"font-size:12px;color:#8b7fa0\">Data</div><div style=\"font-size:16px;color:#2b2b2b;font-weight:bold\">{{data_agendamento}}</div></td></tr></table><table><tr><td style=\"font-size:18px\">🕐</td><td><div style=\"font-size:12px;color:#8b7fa0\">Horário</div><div style=\"font-size:16px;color:#2b2b2b;font-weight:bold\">{{hora_agendamento}}</div></td></tr></table><table><tr><td style=\"font-size:18px\">🧵</td><td><div style=\"font-size:12px;color:#8b7fa0\">Profissional</div><div style=\"font-size:16px;color:#2b2b2b;font-weight:bold\">{{nome_costureira}}</div></td></tr></table><table><tr><td style=\"font-size:18px\">🏢</td><td><div style=\"font-size:12px;color:#8b7fa0\">Local</div><div style=\"font-size:16px;color:#2b2b2b;font-weight:bold\">{{nome_empresa}}</div></td></tr></table></td></tr></table></td></tr><tr><td align=\"center\" style=\"padding:28px 40px 8px 40px\"><table><tr><td align=\"center\" style=\"background-color:#6b4c8a\"><a href=\"{{link_acompanhamento}}\" style=\"padding:16px 24px;font-size:16px;font-weight:bold;color:#ffffff;background-color:#6b4c8a\"> Acompanhar meu agendamento</a></td></tr></table></td></tr><tr><td align=\"center\" style=\"padding:4px 40px 0 40px;font-size:13px;color:#8b7fa0\">Se o botão não funcionar, copie e cole este link no seu navegador:<br /><a href=\"{{link_acompanhamento}}\" style=\"color:#6b4c8a\">{{link_acompanhamento}}</a></td></tr><tr><td style=\"padding:24px 40px 0 40px\"><p style=\"margin:0;font-size:14px;color:#6b6b6b\">Precisa remarcar ou cancelar? Entre em contato com a gente pelo telefone<a style=\"color:#6b4c8a;font-weight:bold\">{{telefone_empresa}}</a>com pelo menos 24 horas de antecedência.</p></td></tr><tr><td style=\"padding:32px 24px 0 24px\"><table><tr><td> </td></tr></table></td></tr><tr><td align=\"center\" style=\"padding:24px 24px 36px 24px\"><p style=\"margin:0 0 6px 0;font-size:15px;color:#3d3d3d;font-weight:bold\">{{nome_empresa}}</p><p style=\"margin:0;font-size:13px;color:#8b7fa0\">Telefone: {{telefone_empresa}}</p><p style=\"margin:16px 0 0 0;font-size:12px;color:#a99fb8\">Este é um e-mail automático, não responda a esta mensagem.</p></td></tr></table></td></tr></table>",
            "ind_ativo": 1,
            "updated_at": "2026-11-20T00:03:17.000Z"
        }
    }
    ```
  * Preview Template:
    * **Método HTTP**: PUT
    * **URL**: /api/sistema/empresa/{id}/email-templates/{evento}/preview
    * **Campos**: id, id_empresa, ind_evento, des_assunto, des_corpo_html, ind_ativo, id_usuario_alteracao, created_at, updated_at
    * **Autenticação**: já existe httpClient com token via cookie.
    * **Cache**: staleTime de 5 minutos.
    * **Chaves**: templateEmailKeys.
    * **Validação**: schema com os mesmos campos
    * **Estrutura de dados (enviado)**:
    ```json
    {
        "des_assunto":"Agendamento Cadastrado",
        "des_corpo_html":"teste"
    }
    ```
    * **Estrutura de dados (resposta)**:
    ```json
    {
        "sucesso": true,
        "dados": {
            "assunto": "Agendamento Cadastrado",
            "html": "teste",
            "texto": "teste"
        }
    }
    ```
    
formulário tem os seguintes campos no banco de dados: 
```sql
CREATE TABLE `tab_email_template` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_empresa` int NOT NULL,
  `ind_evento` enum('agendamento_cadastrado','agendamento_concluido','agendamento_cancelado') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `des_assunto` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `des_corpo_html` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ind_ativo` tinyint(1) NOT NULL DEFAULT '1',
  `id_usuario_alteracao` int DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_template_empresa_evento` (`id_empresa`,`ind_evento`),
  KEY `fk_template_usuario` (`id_usuario_alteracao`),
  CONSTRAINT `fk_template_empresa` FOREIGN KEY (`id_empresa`) REFERENCES `tab_empresa` (`id`),
  CONSTRAINT `fk_template_usuario` FOREIGN KEY (`id_usuario_alteracao`) REFERENCES `tab_pessoas` (`id`)
) ENGINE=InnoDB
```

Arquitetura das pastas:
```text
src/
├── app/
│   ├── (private)/
│   │   ├── parametros
│   │   │   ├── Template
│   │   │   │   ├── columns.tsx
│   │   │   │   └── page.tsx
│   │   │   └── ...
│   │   └── ...
│   └── ...
├── features/
│   ├── parametrizacao
│   │   ├── template
│   │   │   ├── api.ts
│   │   │   ├── hooks.ts
│   │   │   ├── queryKeys.ts
│   │   │   ├── schema.ts
│   │   │   └── types.ts
│   │   └── ...
│   └── ...
└── ...
```

```ts
// features/parametrizacao/empresa/api.ts
import { httpClient } from '@/lib/http/client';
import { Empresa, EmpresaListResponse, ParametrizacaoListResponse } from './types';
import { EmpresaFormValues } from './schema';

const CAMPOS_IMAGEM = [
    'des_url_logo_vertical',
    'des_url_logo_horizontal',
    'des_url_logo_vertical_negativa',
    'des_url_logo_horizontal_negativa',
] as const;

const CAMPOS_VIRTUAIS = ['nom_estado'] as const;

function removerCamposVirtuais(payload: Record<string, any>): Record<string, any> {
    const resultado = { ...payload };
    CAMPOS_VIRTUAIS.forEach((campo) => delete resultado[campo]);
    return resultado;
}

function normalizarCorPrincipal(payload: Record<string, any>): Record<string, any> {
    const resultado = { ...payload };
    if (typeof resultado.val_cor_principal === 'string') {
        resultado.val_cor_principal = resultado.val_cor_principal.replace('#', '');
    }
    return resultado;
}

function montarFormData(payload: Record<string, any>): FormData {
    const formData = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') return;

        if (CAMPOS_IMAGEM.includes(key as any)) {
            // Só envia se for um File novo. Se for string (url existente), não reenvia.
            if (value instanceof File) {
                formData.append(key, value);
            }
            return;
        }

        if (typeof value === 'boolean') {
            formData.append(key, value ? '1' : '0');
            return;
        }

        formData.append(key, String(value));
    });

    return formData;
}

function possuiNovaImagem(payload: Record<string, any>): boolean {
    return CAMPOS_IMAGEM.some((campo) => payload[campo] instanceof File);
}

export const empresaApi = {
    listar: () => httpClient.get<EmpresaListResponse>('/api/sistema/empresa'),
    buscarPorId: (id: number) => httpClient.get<{ dados: Empresa }>(`/api/sistema/empresa/${id}`),
    criar: (payload: EmpresaFormValues) => {

        const dadosLimpos = normalizarCorPrincipal(removerCamposVirtuais(payload));

        if (possuiNovaImagem(dadosLimpos)) {
            return httpClient.post<Empresa>('/api/sistema/empresa', montarFormData(dadosLimpos));
        }

        return httpClient.post<Empresa>('/api/sistema/empresa', dadosLimpos);
    },
    atualizar: (id: number, payload: Partial<EmpresaFormValues>) => {

        const dadosLimpos = normalizarCorPrincipal(removerCamposVirtuais(payload));

        if (possuiNovaImagem(dadosLimpos)) {
            return httpClient.put<Empresa>(`/api/sistema/empresa/${id}`, montarFormData(payload));
        }

        return httpClient.put<Empresa>(`/api/sistema/empresa/${id}`, dadosLimpos);
    },
    deletar: (id: number) => httpClient.delete(`/api/sistema/empresa/${id}`),
    listarHorarios: (idEmpresa: number) => httpClient.get<ParametrizacaoListResponse>(`/api/sistema/parametrizacao`),
};
```

```ts
// features/parametrizacao/empresa/hooks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { empresaApi } from './api';
import { empresaKeys } from './queryKeys';
import { EmpresaFormValues } from './schema';

export function useEmpresas() {
    return useQuery({
        queryKey: empresaKeys.list(),
        queryFn: empresaApi.listar,
    });
}

export function useEmpresa(id: number | null) {
    return useQuery({
        queryKey: empresaKeys.detail(id ?? 0),
        queryFn: () => empresaApi.buscarPorId(id as number),
        enabled: !!id,
    });
}

export function useHorariosEmpresa(idEmpresa: number | null) {
    return useQuery({
        queryKey: empresaKeys.horarios(idEmpresa ?? 0),
        queryFn: () => empresaApi.listarHorarios(idEmpresa as number),
        enabled: !!idEmpresa,
    });
}

export function useCriarEmpresa() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload: EmpresaFormValues) => empresaApi.criar(payload),
        onSuccess: () => qc.invalidateQueries({ queryKey: empresaKeys.all }),
    });
}

export function useAtualizarEmpresa() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: Partial<EmpresaFormValues> }) =>
            empresaApi.atualizar(id, payload),
        onSuccess: () => qc.invalidateQueries({ queryKey: empresaKeys.all }),
    });
}

export function useDeletarEmpresa() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => empresaApi.deletar(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: empresaKeys.all }),
    });
}
```

```ts
// features/parametrizacao/empresa/queryKeys.ts

export const empresaKeys = {
    all: ['empresas'] as const,
    list: (params?: Record<string, unknown>) => ['empresas', 'list', params] as const,
    detail: (id: number) => ['empresas', 'detail', id] as const,
    horarios: (idEmpresa: number) => ['empresas', idEmpresa, 'horarios'] as const,
};
```

```ts
// features/parametrizacao/empresa/schema.ts
import { z } from 'zod';

const somenteDigitos = (v: string) => v.replace(/\D/g, '');

const imagemField = z
    .union([z.instanceof(File), z.string(), z.null()])
    .optional();

export const empresaSchema = z.object({
    nom_fantasia: z.string().min(1, 'Nome Fantasia é obrigatório').max(100),
    nom_razao_social: z.string().min(1, 'Razão Social é obrigatória').max(100),
    num_cnpj: z
        .string()
        .transform(somenteDigitos)
        .refine((v) => v.length === 14, 'CNPJ deve ter 14 dígitos'),
    num_inscricao_estadual: z.string().max(20).optional().nullable().transform((v) => v === '' ? null : v),
    dta_abertura: z.string().min(1, 'Data de abertura é obrigatória'),
    num_cep: z
        .string()
        .transform(somenteDigitos)
        .refine((v) => v.length === 8, 'CEP deve ter 8 dígitos'),
    des_logradouro: z.string().min(1, 'Logradouro é obrigatório').max(45),
    num_endereco: z.string().max(255).optional().nullable(),
    des_complemento: z.string().max(100).optional().nullable(),
    nom_bairro: z.string().min(1, 'Bairro é obrigatório').max(100),
    num_celular_1: z
        .string()
        .transform(somenteDigitos)
        .refine((v) => v.length >= 10, 'Celular inválido'),
    ind_whatsapp_1: z.boolean().default(false),
    num_celular_2: z.string().optional().nullable(),
    ind_whatsapp_2: z.boolean().default(false),
    des_email_1: z.string().email('E-mail inválido'),
    des_email_2: z.string().email('E-mail inválido').optional().nullable().or(z.literal('')),
    val_cor_principal: z.string().optional().nullable().transform((v) => (v ? v.replace('#', '') : v)),
    nom_estado: z.string().min(1, 'Estado é obrigatório'),
    id_cidade: z.coerce.number({ invalid_type_error: 'Cidade é obrigatória' }).min(1, 'Cidade é obrigatória'),
    ind_ativo: z.boolean().default(true),
    des_url_logo_vertical: imagemField,
    des_url_logo_horizontal: imagemField,
    des_url_logo_vertical_negativa: imagemField,
    des_url_logo_horizontal_negativa: imagemField,
});

export type EmpresaFormValues = z.infer<typeof empresaSchema>;
```

```ts
// features/parametrizacao/empresa/types.ts

export interface Empresa {
    id: number;
    id_cidade: number;
    nom_fantasia: string;
    nom_razao_social: string;
    num_cnpj: string;
    num_inscricao_estadual: string | null;
    dta_abertura: string; // ISO date
    des_logradouro: string;
    num_endereco: string | null;
    des_complemento: string | null;
    num_cep: string;
    nom_bairro: string;
    num_celular_1: string;
    ind_whatsapp_1: 0 | 1;
    num_celular_2: string | null;
    ind_whatsapp_2: 0 | 1;
    des_email_1: string;
    des_email_2: string | null;
    val_cor_principal: string | null;
    des_url_logo_vertical: string | null;
    des_url_logo_horizontal: string | null;
    des_url_logo_vertical_negativa: string | null;
    des_url_logo_horizontal_negativa: string | null;
    ind_ativo: 0 | 1;
    created_at: string;
    updated_at: string | null;
    deleted_at: string | null;

    // Campos derivados vindos do JOIN com cidade/estado (somente leitura na listagem)
    nom_cidade?: string;
    nom_estado?: string;
    sgl_estado?: string;
}

export interface EmpresaListResponse {
    dados: Empresa[];
    total?: number;
}

export interface ParametrizacaoHorario {
    id: number;
    id_empresa: number; // assunção - ver nota no topo da resposta
    des_tipo_dia: 'UTIL' | 'SABADO';
    hra_inicio: string; // HH:mm:ss
    hra_fim: string; // HH:mm:ss
    qtd_minutos_intervalo: string; // HH:mm:ss
    ind_ativo: 0 | 1;
    created_at: string;
    updated_at: string | null;
}

export interface ParametrizacaoListResponse {
    dados: ParametrizacaoHorario[];
}
```


Gere os seguintes arquivos seguindo a mesma estrutura dos arquivos de exemplo que tenho para a feature de "smtp":
api.ts (métodos de requisição)
hooks.ts (hooks customizados com useQuery/useMutation)
queryKeys.ts (chaves de cache)
schema.ts (validação Zod)
types.ts (interfaces TypeScript)
Obs.: Mantenha a organização em pastas src/features/[Empresa]/ e utilize o httpClient já existente em src/lib/http/client.ts