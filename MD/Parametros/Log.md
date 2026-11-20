Preciso que se comporte como um engenheiro de software sênior, arquiteto de software sênior e desenvolvedor frontend sênior. Preciso implementar uma feature de Logs, em um projeto Next.js 16.2.10 com tanstack/react-query 5.101.2 e um cliente HTTP customizado, vou utilizar Explique em detalhes o que esta acontecendo em cada etapa do processo nos arquivos que serão gerados. Os requisitos são:

1. Filtros por Query Params
    - Filtro por usuario = id_usuario
    - Filtro por ação = des_acao
    - Filtro por tabela = des_tabela
    - Filtro por data = data_inicio e data_fim

* **Endpoints da API AGENDAMENTO**:
  * Listar Agendamento:
    * **Método HTTP**: GET
    * **URL**: /api/relatorios/auditoria
    * **Campos**: id, id_usuario, des_acao, des_tabela, num_registro_id, des_detalhes, num_ip_address, des_user_agent, created_at
    * **Autenticação**: já existe httpClient com token via cookie
    * **Chaves**: logKeys
    * **Validação**: schema com os mesmos campos
    * **Estrutura de dados (resposta)**:
    ```json
    {
        "sucesso": true,
        "dados": {
            "total_logs": 100,
            "periodo": {},
            "por_acao": {
                "login": 3,
                "listar": 30,
                "consultar": 67
            },
            "por_usuario": [
                {
                    "nome": "Administrador do Sistema",
                    "total": 100
                }
            ],
            "por_tabela": {
                "tab_pessoas": 48,
                "tab_empresa": 30,
                "tab_produto_servico": 7,
                "tab_produtos": 7,
                "tab_produto_grade": 2,
                "tab_tamanhos": 2,
                "tab_variacoes_cor_estampa": 2,
                "tab_tipo_servico": 2
            },
            "logs_detalhados": [
                {
                    "id": 2040,
                    "id_usuario": 1,
                    "des_acao": "login",
                    "des_tabela": "tab_pessoas",
                    "num_registro_id": 1,
                    "des_detalhes": {
                        "papeis": [
                            "administrador"
                        ],
                        "sucesso": true
                    },
                    "num_ip_address": "::1",
                    "des_user_agent": "PostmanRuntime/2.16.2",
                    "created_at": "2026-11-16T17:29:29.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 2039,
                    "id_usuario": 1,
                    "des_acao": "listar",
                    "des_tabela": "tab_empresa",
                    "num_registro_id": null,
                    "des_detalhes": {
                        "tipo_consulta": "listar_empresa",
                        "total_registros": 1
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T17:28:38.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 2037,
                    "id_usuario": 1,
                    "des_acao": "login",
                    "des_tabela": "tab_pessoas",
                    "num_registro_id": 1,
                    "des_detalhes": {
                        "papeis": [
                            "administrador"
                        ],
                        "sucesso": true
                    },
                    "num_ip_address": "::1",
                    "des_user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36",
                    "created_at": "2026-11-16T17:28:37.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 2038,
                    "id_usuario": 1,
                    "des_acao": "consultar",
                    "des_tabela": "tab_pessoas",
                    "num_registro_id": 1,
                    "des_detalhes": {
                        "tipo_consulta": "buscar_por_id",
                        "pessoa_consultada": "Administrador do Sistema"
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T17:28:37.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 2036,
                    "id_usuario": 1,
                    "des_acao": "login",
                    "des_tabela": "tab_pessoas",
                    "num_registro_id": 1,
                    "des_detalhes": {
                        "motivo": "Senha inválida",
                        "sucesso": false,
                        "tentativas": 1,
                        "tentativas_restantes": 4
                    },
                    "num_ip_address": "::1",
                    "des_user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36",
                    "created_at": "2026-11-16T17:28:30.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 2030,
                    "id_usuario": 1,
                    "des_acao": "listar",
                    "des_tabela": "tab_empresa",
                    "num_registro_id": null,
                    "des_detalhes": {
                        "tipo_consulta": "listar_empresa",
                        "total_registros": 1
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:35:45.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 2031,
                    "id_usuario": 1,
                    "des_acao": "consultar",
                    "des_tabela": "tab_pessoas",
                    "num_registro_id": null,
                    "des_detalhes": {
                        "papel": "costureira",
                        "tipo_consulta": "listar_por_papel",
                        "total_registros": 2
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:35:45.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 2032,
                    "id_usuario": 1,
                    "des_acao": "consultar",
                    "des_tabela": "tab_pessoas",
                    "num_registro_id": null,
                    "des_detalhes": {
                        "papel": "paciente",
                        "tipo_consulta": "listar_por_papel",
                        "total_registros": 6
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:35:45.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 2033,
                    "id_usuario": 1,
                    "des_acao": "consultar",
                    "des_tabela": "tab_produto_servico",
                    "num_registro_id": null,
                    "des_detalhes": {
                        "tipo_consulta": "listar",
                        "total_registros": 16
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:35:45.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 2034,
                    "id_usuario": 1,
                    "des_acao": "consultar",
                    "des_tabela": "tab_produtos",
                    "num_registro_id": null,
                    "des_detalhes": {
                        "tipo_consulta": "listar",
                        "total_registros": 5
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:35:45.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 2035,
                    "id_usuario": 1,
                    "des_acao": "consultar",
                    "des_tabela": "tab_pessoas",
                    "num_registro_id": null,
                    "des_detalhes": {
                        "papel": "medico",
                        "tipo_consulta": "listar_por_papel",
                        "total_registros": 2
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:35:45.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 2029,
                    "id_usuario": 1,
                    "des_acao": "listar",
                    "des_tabela": "tab_empresa",
                    "num_registro_id": null,
                    "des_detalhes": {
                        "tipo_consulta": "listar_empresa",
                        "total_registros": 1
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:34:01.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 2023,
                    "id_usuario": 1,
                    "des_acao": "listar",
                    "des_tabela": "tab_empresa",
                    "num_registro_id": null,
                    "des_detalhes": {
                        "tipo_consulta": "listar_empresa",
                        "total_registros": 1
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:33:58.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 2024,
                    "id_usuario": 1,
                    "des_acao": "consultar",
                    "des_tabela": "tab_pessoas",
                    "num_registro_id": null,
                    "des_detalhes": {
                        "papel": "costureira",
                        "tipo_consulta": "listar_por_papel",
                        "total_registros": 2
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:33:58.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 2025,
                    "id_usuario": 1,
                    "des_acao": "consultar",
                    "des_tabela": "tab_pessoas",
                    "num_registro_id": null,
                    "des_detalhes": {
                        "papel": "medico",
                        "tipo_consulta": "listar_por_papel",
                        "total_registros": 2
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:33:58.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 2026,
                    "id_usuario": 1,
                    "des_acao": "consultar",
                    "des_tabela": "tab_produtos",
                    "num_registro_id": null,
                    "des_detalhes": {
                        "tipo_consulta": "listar",
                        "total_registros": 5
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:33:58.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 2027,
                    "id_usuario": 1,
                    "des_acao": "consultar",
                    "des_tabela": "tab_pessoas",
                    "num_registro_id": null,
                    "des_detalhes": {
                        "papel": "paciente",
                        "tipo_consulta": "listar_por_papel",
                        "total_registros": 6
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:33:58.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 2028,
                    "id_usuario": 1,
                    "des_acao": "consultar",
                    "des_tabela": "tab_produto_servico",
                    "num_registro_id": null,
                    "des_detalhes": {
                        "tipo_consulta": "listar",
                        "total_registros": 16
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:33:58.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 2017,
                    "id_usuario": 1,
                    "des_acao": "listar",
                    "des_tabela": "tab_empresa",
                    "num_registro_id": null,
                    "des_detalhes": {
                        "tipo_consulta": "listar_empresa",
                        "total_registros": 1
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:33:52.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 2018,
                    "id_usuario": 1,
                    "des_acao": "consultar",
                    "des_tabela": "tab_produto_servico",
                    "num_registro_id": null,
                    "des_detalhes": {
                        "tipo_consulta": "listar",
                        "total_registros": 16
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:33:52.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 2019,
                    "id_usuario": 1,
                    "des_acao": "consultar",
                    "des_tabela": "tab_pessoas",
                    "num_registro_id": null,
                    "des_detalhes": {
                        "papel": "costureira",
                        "tipo_consulta": "listar_por_papel",
                        "total_registros": 2
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:33:52.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 2020,
                    "id_usuario": 1,
                    "des_acao": "consultar",
                    "des_tabela": "tab_pessoas",
                    "num_registro_id": null,
                    "des_detalhes": {
                        "papel": "paciente",
                        "tipo_consulta": "listar_por_papel",
                        "total_registros": 6
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:33:52.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 2021,
                    "id_usuario": 1,
                    "des_acao": "consultar",
                    "des_tabela": "tab_pessoas",
                    "num_registro_id": null,
                    "des_detalhes": {
                        "papel": "medico",
                        "tipo_consulta": "listar_por_papel",
                        "total_registros": 2
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:33:52.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 2022,
                    "id_usuario": 1,
                    "des_acao": "consultar",
                    "des_tabela": "tab_produtos",
                    "num_registro_id": null,
                    "des_detalhes": {
                        "tipo_consulta": "listar",
                        "total_registros": 5
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:33:52.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 2004,
                    "id_usuario": 1,
                    "des_acao": "consultar",
                    "des_tabela": "tab_pessoas",
                    "num_registro_id": null,
                    "des_detalhes": {
                        "papel": "costureira",
                        "tipo_consulta": "listar_por_papel",
                        "total_registros": 2
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:32:39.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 2005,
                    "id_usuario": 1,
                    "des_acao": "listar",
                    "des_tabela": "tab_empresa",
                    "num_registro_id": null,
                    "des_detalhes": {
                        "tipo_consulta": "listar_empresa",
                        "total_registros": 1
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:32:39.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 2006,
                    "id_usuario": 1,
                    "des_acao": "consultar",
                    "des_tabela": "tab_pessoas",
                    "num_registro_id": null,
                    "des_detalhes": {
                        "papel": "paciente",
                        "tipo_consulta": "listar_por_papel",
                        "total_registros": 6
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:32:39.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 2007,
                    "id_usuario": 1,
                    "des_acao": "consultar",
                    "des_tabela": "tab_pessoas",
                    "num_registro_id": null,
                    "des_detalhes": {
                        "papel": "medico",
                        "tipo_consulta": "listar_por_papel",
                        "total_registros": 2
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:32:39.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 2008,
                    "id_usuario": 1,
                    "des_acao": "consultar",
                    "des_tabela": "tab_pessoas",
                    "num_registro_id": 1,
                    "des_detalhes": {
                        "tipo_consulta": "buscar_por_id",
                        "pessoa_consultada": "Administrador do Sistema"
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:32:39.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 2009,
                    "id_usuario": 1,
                    "des_acao": "listar",
                    "des_tabela": "tab_empresa",
                    "num_registro_id": null,
                    "des_detalhes": {
                        "tipo_consulta": "listar_empresa",
                        "total_registros": 1
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:32:39.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 2010,
                    "id_usuario": 1,
                    "des_acao": "consultar",
                    "des_tabela": "tab_produtos",
                    "num_registro_id": null,
                    "des_detalhes": {
                        "tipo_consulta": "listar",
                        "total_registros": 5
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:32:39.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 2011,
                    "id_usuario": 1,
                    "des_acao": "consultar",
                    "des_tabela": "tab_pessoas",
                    "num_registro_id": 9,
                    "des_detalhes": {
                        "tipo_consulta": "buscar_por_id",
                        "pessoa_consultada": "Paciente 1"
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:32:39.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 2012,
                    "id_usuario": 1,
                    "des_acao": "consultar",
                    "des_tabela": "tab_produto_servico",
                    "num_registro_id": null,
                    "des_detalhes": {
                        "tipo_consulta": "listar",
                        "total_registros": 16
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:32:39.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 2013,
                    "id_usuario": 1,
                    "des_acao": "consultar",
                    "des_tabela": "tab_produto_grade",
                    "num_registro_id": null,
                    "des_detalhes": {
                        "tipo_consulta": "listar",
                        "total_registros": 15
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:32:39.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 2014,
                    "id_usuario": 1,
                    "des_acao": "consultar",
                    "des_tabela": "tab_tamanhos",
                    "num_registro_id": null,
                    "des_detalhes": {
                        "tipo_consulta": "listar",
                        "total_registros": 5
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:32:39.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 2015,
                    "id_usuario": 1,
                    "des_acao": "consultar",
                    "des_tabela": "tab_variacoes_cor_estampa",
                    "num_registro_id": null,
                    "des_detalhes": {
                        "tipo_consulta": "listar",
                        "total_registros": 3
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:32:39.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 2016,
                    "id_usuario": 1,
                    "des_acao": "consultar",
                    "des_tabela": "tab_tipo_servico",
                    "num_registro_id": null,
                    "des_detalhes": {
                        "tipo_consulta": "listar",
                        "total_registros": 4
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:32:39.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 1998,
                    "id_usuario": 1,
                    "des_acao": "listar",
                    "des_tabela": "tab_empresa",
                    "num_registro_id": null,
                    "des_detalhes": {
                        "tipo_consulta": "listar_empresa",
                        "total_registros": 1
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:32:37.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 1999,
                    "id_usuario": 1,
                    "des_acao": "consultar",
                    "des_tabela": "tab_pessoas",
                    "num_registro_id": null,
                    "des_detalhes": {
                        "papel": "medico",
                        "tipo_consulta": "listar_por_papel",
                        "total_registros": 2
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:32:37.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 2000,
                    "id_usuario": 1,
                    "des_acao": "consultar",
                    "des_tabela": "tab_pessoas",
                    "num_registro_id": null,
                    "des_detalhes": {
                        "papel": "paciente",
                        "tipo_consulta": "listar_por_papel",
                        "total_registros": 6
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:32:37.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 2001,
                    "id_usuario": 1,
                    "des_acao": "consultar",
                    "des_tabela": "tab_pessoas",
                    "num_registro_id": null,
                    "des_detalhes": {
                        "papel": "costureira",
                        "tipo_consulta": "listar_por_papel",
                        "total_registros": 2
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:32:37.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 2002,
                    "id_usuario": 1,
                    "des_acao": "consultar",
                    "des_tabela": "tab_produtos",
                    "num_registro_id": null,
                    "des_detalhes": {
                        "tipo_consulta": "listar",
                        "total_registros": 5
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:32:37.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 2003,
                    "id_usuario": 1,
                    "des_acao": "consultar",
                    "des_tabela": "tab_produto_servico",
                    "num_registro_id": null,
                    "des_detalhes": {
                        "tipo_consulta": "listar",
                        "total_registros": 16
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:32:37.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 1992,
                    "id_usuario": 1,
                    "des_acao": "listar",
                    "des_tabela": "tab_empresa",
                    "num_registro_id": null,
                    "des_detalhes": {
                        "tipo_consulta": "listar_empresa",
                        "total_registros": 1
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:32:22.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 1993,
                    "id_usuario": 1,
                    "des_acao": "consultar",
                    "des_tabela": "tab_pessoas",
                    "num_registro_id": null,
                    "des_detalhes": {
                        "papel": "paciente",
                        "tipo_consulta": "listar_por_papel",
                        "total_registros": 6
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:32:22.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 1994,
                    "id_usuario": 1,
                    "des_acao": "consultar",
                    "des_tabela": "tab_pessoas",
                    "num_registro_id": null,
                    "des_detalhes": {
                        "papel": "costureira",
                        "tipo_consulta": "listar_por_papel",
                        "total_registros": 2
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:32:22.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 1995,
                    "id_usuario": 1,
                    "des_acao": "consultar",
                    "des_tabela": "tab_produtos",
                    "num_registro_id": null,
                    "des_detalhes": {
                        "tipo_consulta": "listar",
                        "total_registros": 5
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:32:22.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 1996,
                    "id_usuario": 1,
                    "des_acao": "consultar",
                    "des_tabela": "tab_produto_servico",
                    "num_registro_id": null,
                    "des_detalhes": {
                        "tipo_consulta": "listar",
                        "total_registros": 16
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:32:22.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 1997,
                    "id_usuario": 1,
                    "des_acao": "consultar",
                    "des_tabela": "tab_pessoas",
                    "num_registro_id": null,
                    "des_detalhes": {
                        "papel": "medico",
                        "tipo_consulta": "listar_por_papel",
                        "total_registros": 2
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:32:22.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 1981,
                    "id_usuario": 1,
                    "des_acao": "listar",
                    "des_tabela": "tab_empresa",
                    "num_registro_id": null,
                    "des_detalhes": {
                        "tipo_consulta": "listar_empresa",
                        "total_registros": 1
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:32:05.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 1982,
                    "id_usuario": 1,
                    "des_acao": "consultar",
                    "des_tabela": "tab_variacoes_cor_estampa",
                    "num_registro_id": null,
                    "des_detalhes": {
                        "tipo_consulta": "listar",
                        "total_registros": 3
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:32:05.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 1983,
                    "id_usuario": 1,
                    "des_acao": "consultar",
                    "des_tabela": "tab_tamanhos",
                    "num_registro_id": null,
                    "des_detalhes": {
                        "tipo_consulta": "listar",
                        "total_registros": 5
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:32:05.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 1984,
                    "id_usuario": 1,
                    "des_acao": "consultar",
                    "des_tabela": "tab_produto_grade",
                    "num_registro_id": null,
                    "des_detalhes": {
                        "tipo_consulta": "listar",
                        "total_registros": 15
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:32:05.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 1985,
                    "id_usuario": 1,
                    "des_acao": "consultar",
                    "des_tabela": "tab_pessoas",
                    "num_registro_id": null,
                    "des_detalhes": {
                        "papel": "costureira",
                        "tipo_consulta": "listar_por_papel",
                        "total_registros": 2
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:32:05.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 1986,
                    "id_usuario": 1,
                    "des_acao": "consultar",
                    "des_tabela": "tab_produtos",
                    "num_registro_id": null,
                    "des_detalhes": {
                        "tipo_consulta": "listar",
                        "total_registros": 5
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:32:05.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 1987,
                    "id_usuario": 1,
                    "des_acao": "consultar",
                    "des_tabela": "tab_produto_servico",
                    "num_registro_id": null,
                    "des_detalhes": {
                        "tipo_consulta": "listar",
                        "total_registros": 16
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:32:05.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 1988,
                    "id_usuario": 1,
                    "des_acao": "consultar",
                    "des_tabela": "tab_tipo_servico",
                    "num_registro_id": null,
                    "des_detalhes": {
                        "tipo_consulta": "listar",
                        "total_registros": 4
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:32:05.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 1989,
                    "id_usuario": 1,
                    "des_acao": "consultar",
                    "des_tabela": "tab_pessoas",
                    "num_registro_id": null,
                    "des_detalhes": {
                        "papel": "paciente",
                        "tipo_consulta": "listar_por_papel",
                        "total_registros": 6
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:32:05.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 1990,
                    "id_usuario": 1,
                    "des_acao": "consultar",
                    "des_tabela": "tab_pessoas",
                    "num_registro_id": null,
                    "des_detalhes": {
                        "papel": "medico",
                        "tipo_consulta": "listar_por_papel",
                        "total_registros": 2
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:32:05.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 1991,
                    "id_usuario": 1,
                    "des_acao": "consultar",
                    "des_tabela": "tab_pessoas",
                    "num_registro_id": 10,
                    "des_detalhes": {
                        "tipo_consulta": "buscar_por_id",
                        "pessoa_consultada": "Paciente 2"
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:32:05.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 1979,
                    "id_usuario": 1,
                    "des_acao": "consultar",
                    "des_tabela": "tab_pessoas",
                    "num_registro_id": 1,
                    "des_detalhes": {
                        "tipo_consulta": "buscar_por_id",
                        "pessoa_consultada": "Administrador do Sistema"
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:30:53.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 1980,
                    "id_usuario": 1,
                    "des_acao": "listar",
                    "des_tabela": "tab_empresa",
                    "num_registro_id": null,
                    "des_detalhes": {
                        "tipo_consulta": "listar_empresa",
                        "total_registros": 1
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:30:53.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 1977,
                    "id_usuario": 1,
                    "des_acao": "consultar",
                    "des_tabela": "tab_pessoas",
                    "num_registro_id": 1,
                    "des_detalhes": {
                        "tipo_consulta": "buscar_por_id",
                        "pessoa_consultada": "Administrador do Sistema"
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:26:16.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 1978,
                    "id_usuario": 1,
                    "des_acao": "listar",
                    "des_tabela": "tab_empresa",
                    "num_registro_id": null,
                    "des_detalhes": {
                        "tipo_consulta": "listar_empresa",
                        "total_registros": 1
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:26:16.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 1975,
                    "id_usuario": 1,
                    "des_acao": "consultar",
                    "des_tabela": "tab_pessoas",
                    "num_registro_id": 1,
                    "des_detalhes": {
                        "tipo_consulta": "buscar_por_id",
                        "pessoa_consultada": "Administrador do Sistema"
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:22:52.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 1976,
                    "id_usuario": 1,
                    "des_acao": "listar",
                    "des_tabela": "tab_empresa",
                    "num_registro_id": null,
                    "des_detalhes": {
                        "tipo_consulta": "listar_empresa",
                        "total_registros": 1
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:22:52.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 1973,
                    "id_usuario": 1,
                    "des_acao": "consultar",
                    "des_tabela": "tab_pessoas",
                    "num_registro_id": 1,
                    "des_detalhes": {
                        "tipo_consulta": "buscar_por_id",
                        "pessoa_consultada": "Administrador do Sistema"
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:22:27.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 1974,
                    "id_usuario": 1,
                    "des_acao": "listar",
                    "des_tabela": "tab_empresa",
                    "num_registro_id": null,
                    "des_detalhes": {
                        "tipo_consulta": "listar_empresa",
                        "total_registros": 1
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:22:27.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 1971,
                    "id_usuario": 1,
                    "des_acao": "consultar",
                    "des_tabela": "tab_pessoas",
                    "num_registro_id": 1,
                    "des_detalhes": {
                        "tipo_consulta": "buscar_por_id",
                        "pessoa_consultada": "Administrador do Sistema"
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:22:01.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 1972,
                    "id_usuario": 1,
                    "des_acao": "listar",
                    "des_tabela": "tab_empresa",
                    "num_registro_id": null,
                    "des_detalhes": {
                        "tipo_consulta": "listar_empresa",
                        "total_registros": 1
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:22:01.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 1969,
                    "id_usuario": 1,
                    "des_acao": "consultar",
                    "des_tabela": "tab_pessoas",
                    "num_registro_id": 1,
                    "des_detalhes": {
                        "tipo_consulta": "buscar_por_id",
                        "pessoa_consultada": "Administrador do Sistema"
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:21:29.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 1970,
                    "id_usuario": 1,
                    "des_acao": "listar",
                    "des_tabela": "tab_empresa",
                    "num_registro_id": null,
                    "des_detalhes": {
                        "tipo_consulta": "listar_empresa",
                        "total_registros": 1
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:21:29.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 1967,
                    "id_usuario": 1,
                    "des_acao": "consultar",
                    "des_tabela": "tab_pessoas",
                    "num_registro_id": 1,
                    "des_detalhes": {
                        "tipo_consulta": "buscar_por_id",
                        "pessoa_consultada": "Administrador do Sistema"
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:19:11.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 1968,
                    "id_usuario": 1,
                    "des_acao": "listar",
                    "des_tabela": "tab_empresa",
                    "num_registro_id": null,
                    "des_detalhes": {
                        "tipo_consulta": "listar_empresa",
                        "total_registros": 1
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:19:11.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 1965,
                    "id_usuario": 1,
                    "des_acao": "consultar",
                    "des_tabela": "tab_pessoas",
                    "num_registro_id": 1,
                    "des_detalhes": {
                        "tipo_consulta": "buscar_por_id",
                        "pessoa_consultada": "Administrador do Sistema"
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:18:58.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 1966,
                    "id_usuario": 1,
                    "des_acao": "listar",
                    "des_tabela": "tab_empresa",
                    "num_registro_id": null,
                    "des_detalhes": {
                        "tipo_consulta": "listar_empresa",
                        "total_registros": 1
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:18:58.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 1963,
                    "id_usuario": 1,
                    "des_acao": "consultar",
                    "des_tabela": "tab_pessoas",
                    "num_registro_id": 1,
                    "des_detalhes": {
                        "tipo_consulta": "buscar_por_id",
                        "pessoa_consultada": "Administrador do Sistema"
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:17:53.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 1964,
                    "id_usuario": 1,
                    "des_acao": "listar",
                    "des_tabela": "tab_empresa",
                    "num_registro_id": null,
                    "des_detalhes": {
                        "tipo_consulta": "listar_empresa",
                        "total_registros": 1
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:17:53.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 1961,
                    "id_usuario": 1,
                    "des_acao": "listar",
                    "des_tabela": "tab_empresa",
                    "num_registro_id": null,
                    "des_detalhes": {
                        "tipo_consulta": "listar_empresa",
                        "total_registros": 1
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:17:38.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 1962,
                    "id_usuario": 1,
                    "des_acao": "consultar",
                    "des_tabela": "tab_pessoas",
                    "num_registro_id": 1,
                    "des_detalhes": {
                        "tipo_consulta": "buscar_por_id",
                        "pessoa_consultada": "Administrador do Sistema"
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:17:38.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 1959,
                    "id_usuario": 1,
                    "des_acao": "consultar",
                    "des_tabela": "tab_pessoas",
                    "num_registro_id": 1,
                    "des_detalhes": {
                        "tipo_consulta": "buscar_por_id",
                        "pessoa_consultada": "Administrador do Sistema"
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:16:39.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 1960,
                    "id_usuario": 1,
                    "des_acao": "listar",
                    "des_tabela": "tab_empresa",
                    "num_registro_id": null,
                    "des_detalhes": {
                        "tipo_consulta": "listar_empresa",
                        "total_registros": 1
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:16:39.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 1957,
                    "id_usuario": 1,
                    "des_acao": "consultar",
                    "des_tabela": "tab_pessoas",
                    "num_registro_id": 1,
                    "des_detalhes": {
                        "tipo_consulta": "buscar_por_id",
                        "pessoa_consultada": "Administrador do Sistema"
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:16:05.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 1958,
                    "id_usuario": 1,
                    "des_acao": "listar",
                    "des_tabela": "tab_empresa",
                    "num_registro_id": null,
                    "des_detalhes": {
                        "tipo_consulta": "listar_empresa",
                        "total_registros": 1
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:16:05.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 1955,
                    "id_usuario": 1,
                    "des_acao": "listar",
                    "des_tabela": "tab_empresa",
                    "num_registro_id": null,
                    "des_detalhes": {
                        "tipo_consulta": "listar_empresa",
                        "total_registros": 1
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:15:25.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 1956,
                    "id_usuario": 1,
                    "des_acao": "consultar",
                    "des_tabela": "tab_pessoas",
                    "num_registro_id": 1,
                    "des_detalhes": {
                        "tipo_consulta": "buscar_por_id",
                        "pessoa_consultada": "Administrador do Sistema"
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:15:25.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 1953,
                    "id_usuario": 1,
                    "des_acao": "consultar",
                    "des_tabela": "tab_pessoas",
                    "num_registro_id": 1,
                    "des_detalhes": {
                        "tipo_consulta": "buscar_por_id",
                        "pessoa_consultada": "Administrador do Sistema"
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:13:53.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 1954,
                    "id_usuario": 1,
                    "des_acao": "listar",
                    "des_tabela": "tab_empresa",
                    "num_registro_id": null,
                    "des_detalhes": {
                        "tipo_consulta": "listar_empresa",
                        "total_registros": 1
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:13:53.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 1951,
                    "id_usuario": 1,
                    "des_acao": "listar",
                    "des_tabela": "tab_empresa",
                    "num_registro_id": null,
                    "des_detalhes": {
                        "tipo_consulta": "listar_empresa",
                        "total_registros": 1
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:08:48.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 1952,
                    "id_usuario": 1,
                    "des_acao": "consultar",
                    "des_tabela": "tab_pessoas",
                    "num_registro_id": 1,
                    "des_detalhes": {
                        "tipo_consulta": "buscar_por_id",
                        "pessoa_consultada": "Administrador do Sistema"
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:08:48.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 1949,
                    "id_usuario": 1,
                    "des_acao": "consultar",
                    "des_tabela": "tab_pessoas",
                    "num_registro_id": 1,
                    "des_detalhes": {
                        "tipo_consulta": "buscar_por_id",
                        "pessoa_consultada": "Administrador do Sistema"
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:06:50.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 1950,
                    "id_usuario": 1,
                    "des_acao": "listar",
                    "des_tabela": "tab_empresa",
                    "num_registro_id": null,
                    "des_detalhes": {
                        "tipo_consulta": "listar_empresa",
                        "total_registros": 1
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:06:50.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 1947,
                    "id_usuario": 1,
                    "des_acao": "listar",
                    "des_tabela": "tab_empresa",
                    "num_registro_id": null,
                    "des_detalhes": {
                        "tipo_consulta": "listar_empresa",
                        "total_registros": 1
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:06:30.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 1948,
                    "id_usuario": 1,
                    "des_acao": "consultar",
                    "des_tabela": "tab_pessoas",
                    "num_registro_id": 1,
                    "des_detalhes": {
                        "tipo_consulta": "buscar_por_id",
                        "pessoa_consultada": "Administrador do Sistema"
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:06:30.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 1945,
                    "id_usuario": 1,
                    "des_acao": "consultar",
                    "des_tabela": "tab_pessoas",
                    "num_registro_id": 1,
                    "des_detalhes": {
                        "tipo_consulta": "buscar_por_id",
                        "pessoa_consultada": "Administrador do Sistema"
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:04:27.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 1946,
                    "id_usuario": 1,
                    "des_acao": "listar",
                    "des_tabela": "tab_empresa",
                    "num_registro_id": null,
                    "des_detalhes": {
                        "tipo_consulta": "listar_empresa",
                        "total_registros": 1
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:04:27.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 1943,
                    "id_usuario": 1,
                    "des_acao": "consultar",
                    "des_tabela": "tab_pessoas",
                    "num_registro_id": 1,
                    "des_detalhes": {
                        "tipo_consulta": "buscar_por_id",
                        "pessoa_consultada": "Administrador do Sistema"
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:03:30.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 1944,
                    "id_usuario": 1,
                    "des_acao": "listar",
                    "des_tabela": "tab_empresa",
                    "num_registro_id": null,
                    "des_detalhes": {
                        "tipo_consulta": "listar_empresa",
                        "total_registros": 1
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:03:30.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 1941,
                    "id_usuario": 1,
                    "des_acao": "consultar",
                    "des_tabela": "tab_pessoas",
                    "num_registro_id": 1,
                    "des_detalhes": {
                        "tipo_consulta": "buscar_por_id",
                        "pessoa_consultada": "Administrador do Sistema"
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:02:35.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                },
                {
                    "id": 1942,
                    "id_usuario": 1,
                    "des_acao": "listar",
                    "des_tabela": "tab_empresa",
                    "num_registro_id": null,
                    "des_detalhes": {
                        "tipo_consulta": "listar_empresa",
                        "total_registros": 1
                    },
                    "num_ip_address": null,
                    "des_user_agent": null,
                    "created_at": "2026-11-16T07:02:35.000Z",
                    "usuario_nome": "Administrador do Sistema",
                    "usuario_administrador": 1,
                    "usuario_costureira": 0,
                    "usuario_secretaria": 0,
                    "usuario_medico": 0,
                    "usuario_paciente": 0
                }
            ]
        }
    }
    ```
    formulário tem os seguintes campos no banco de dados: 
```sql
CREATE TABLE `tab_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int DEFAULT NULL,
  `des_acao` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `des_tabela` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `num_registro_id` int DEFAULT NULL,
  `des_detalhes` json DEFAULT NULL,
  `num_ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `des_user_agent` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_usuario` (`id_usuario`),
  KEY `idx_acao` (`des_acao`),
  KEY `idx_tabela` (`des_tabela`),
  KEY `idx_criado` (`created_at`),
  KEY `idx_tabela_registro` (`des_tabela`,`num_registro_id`),
  CONSTRAINT `tab_log_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `tab_pessoas` (`id`)
) ENGINE=InnoDB
Arquitetura das pastas:
```text
src/
├── app/
    └── (private)/
        └── Parametros
            └── log
                ├── columns.tsx
                └── page.tsx
```
Gere os seguintes arquivos seguindo a mesma estrutura dos arquivos de exemplo que tenho para a feature de "Log":
* api.ts (métodos de requisição)
* hooks.ts (hooks customizados com useQuery/useMutation)
* queryKeys.ts (chaves de cache)
* schema.ts (validação Zod)
* types.ts (interfaces TypeScript)
Obs.: Mantenha a organização em pastas src/features/parametrizacao/log/ e utilize o httpClient já existente em src/lib/http/client.ts

Gerar também os arquivo columns.tsx (para tabela) e a page.tsx da tela de listagem, seguindo o padrão dos arquivos anexado exibido na arquitetura de Produto.
