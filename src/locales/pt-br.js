module.exports = {
      "resultsBtn": "Mostrar Resultados",
      "About": {
            "p1": "Uma boa definição de estatística é a de ser um conjunto de métodos especialmente apropriados à coleta, à apresentação (organização, resumo e descrição), à análise e à interpretação de dados de observação, tendo como objetivo a compreensão de uma realidade específica para a tomada da decisão. Este projeto foi desenvolvido com intuito de otimizar tais análises através da criação de um sistema web, o qual tem foco na apresentação e interpretação de resultados esperados das análises de dados.",
            "p2": "Em outras palavras, o Data Tongjì atende todo o tipo de usuário que está interessado em fazer cálculos estatísticos (limitado a todas as operações da Estatística Descritiva, Probabilidade, Correlação e Regressão) com rapidez e eficiência. Sua interface é agradável e harmoniosa e não requer conhecimentos avançados para sua utilização, o usuário deverá informar os dados que serão analisados, o software irá realizar os cálculos e ele deverá saber interpretar os resultados."
      },
      "Menu": {
            "Correg": "Correlação / Regressão",
            "Dash": "Menu Principal",
            "Talk": "Fale com a gente",
            "profile": "Perfil do usuário",
            "lang": {
                  "pt": "Português",
                  "en": "Inglês"
            }
      },
      "Forms": {
            "talk": {
                  "inputmsg": {
                        "title": "Mensagem",
                        "error": "O campo mensagem não pode ficar em branco!"
                  },
                  "sendmail": "Mensagem enviada!"
            },
            "email": {
                  "title": "Endereço de email",
                  "error": "Insira um endereço de email válido!"
            },
            "name": {
                  "title": "Nome",
                  "error": "Insira o seu nome!"
            },
            "pass": {
                  "title": "Senha",
                  "error": "Insira uma senha válida!",
                  "changed": "Senha alterada com sucesso!",
                  "title2": "Informe a nova senha"
            },
            "token": {
                  "title": "Token de Autenticação",
                  "error": "Insira o Token de Autenticação!",
                  "msg": "O Token de Autenticação foi enviado no seu email!",                  
                  "valid": "Token validado!",
                  "info": "Informe o Token de Autenticação que enviamos no seu email"
            },
            "btnenv": {
                  "ac1": "Enviar",
                  "ac2": "Alterar senha"
            },
            "reg": {
                  "msg": "Usuário cadastrado com sucesso!"
            }
      },
      "NavBar": {
            "ac1": "Perfil",
            "ac2": "Sair",
            "auth": {
                  "ac1": "Entrar",
                  "ac2": "Sobre",
                  "ac3": "Fale com a gente",
                  "ac4": "Registrar",
            }
      },
      "Profile": {
            "title": "Perfil do Usuário",
            "avatar": "Mudar foto de perfil",
            "sidecolor": "Cor da Sidebar",
            "language": "Idioma",
            "bgcolor": {
                  "light": "MODO CLARO",
                  "dark": "MODO ESCURO"
            },
            "error1": "Apenas arquivos .png, .jpg or .jpeg são aceitos!",
            "msg1": "Suas alterações foram salvas!"
      },
      "Modal": {
            "btn1": "Fechar",
            "btn2": "Salvar",
            "info": {
                  "title": "Precisa de ajuda?",
                  "probabilityText": "A <b>distribuição normal</b> é um tipo de probabilidade simétrica em relação à média, ilustra que a ocorrência dos dados próximos a ela é mais frequente do que os dados que estão distantes. Na forma de gráfico, a distribuição normal aparecerá como uma curva de sino. A distribuição normal possui dois parâmetros: a <b>média</b>  e o <b>desvio padrão</b>. <br/>A <b>distribuição uniforme</b>  é um tipo de probabilidade em que todos os resultados são igualmente prováveis, cada variável tem a mesma probabilidade de que será o resultado. Essa distribuição é definida por dois parâmetros: o <b>ponto mínimo (inicial)</b> e o <b>ponto máximo (final)</b>. <br/>A <b>distribuição binomial</b>  resume a probabilidade de um valor assumir um dos dois valores independentes sob um determinado conjunto de parâmetros ou suposições. As suposições subjacentes à distribuição binomial são que existe apenas um resultado para cada tentativa, que cada tentativa tem a mesma probabilidade de sucesso e que cada tentativa é mutuamente exclusiva ou independente uma da outra. Portanto, representa a probabilidade de <b><i>k</i> eventos</b> em <b><i>n</i> tentativas</b>, dada a probabilidade de <b>sucesso (<i>p</i>)</b> ou <b>fracasso (<i>q</i>)</b>  para cada tentativa.",
                  "corregText": "<b>Correlação</b> é um método de análise estatística que determina o co-relacionamento ou associação de duas variáveis, usando o <b>coeficiente de correlação</b>, que indica a extensão em que duas variáveis ​​se movem juntas.<br /> A <b>Regressão</b> descreve como uma variável independente está numericamente relacionada à variável dependente. Indica o impacto de uma alteração de unidade na variável conhecida (x) na variável estimada (y).<br /> Use os campos de entrada abaixo para inserir os dados manualmente ou importar um arquivo <b>.csv</b> e calcular os resultados, utilize <a href='https://raw.githubusercontent.com/leoronne/datatongji/master/src/assets/files/Correlation-Regression.csv' target='_blank'>este</a> arquivo como exemplo.",

            },
            "save": {
                  "title": "Salvar Análise",
                  "text": "Você deseja salvar a análise realizada?",
                  "message": "Sua análise foi salva!",
                  "lbl1": "Nome da análise",
                  "input1": "Nome",
                  "validate": "Por favor, calcule os resultados primeiro!"
            }
      },
      "Descriptive": {
            "title": "Análise Descritiva"
      },
      "Probability": {
            "title": "Probabilidade",
            "genericError": "inválido",
            "interval": {
                  "title": "O intervalo entre os valores deve ser",
                  "error1": "Selecione um tipo de intervalo!",
                  "error2": "O ponto máximo deve ser maior que o ponto mínimo!",
                  "erroroptmin": "Valor do ponto mínimo inválido!",
                  "erroroptmax": "Valor do ponto máximo inválido!",
                  "opt1": "menor que",
                  "opt2": "entre",
                  "opt3": "exatamente",
                  "opt4": "maior que",
            },
            "Normal": {
                  "title": "Normal",
                  "mean": {
                        "title": "Valor da Média",
                        "error": "Valor da Média inválido!"
                  },
                  "std": {
                        "title": "Valor do Desvio Padrão",
                        "error": "Valor de Desvio Padrão inválido!"
                  },
            },
            "Uniform": {
                  "title": "Uniforme",
                  "error1": "O valor final deve ser maior que o inicial!",
                  "initial": {
                        "title": "Valor inicial",
                        "error": "Valor inicial inválido!"
                  },
                  "final": {
                        "title": "Valor Final",
                        "error": "Valor Final inválido!"
                  },
            },
            "Binomial": {
                  "title": "Binomial",
                  "sample": {
                        "title": "Tamanho da amostra (n)",
                        "error": "Tamanho da amostra (n) inválido!"
                  },
                  "p": {
                        "title": "Valor do Sucesso (p)",
                        "error": "Valor do Sucesso (p) inválido!"
                  },
                  "q": {
                        "title": "Valor do Fracasso (q)",
                        "error": "Valor do Fracasso (q) inválido!"
                  },
                  "event": {
                        "title": "O evento (k) deve ser",
                        "error1": "Valor do Evento (k) inválido!",
                        "error2": "Valor do Evento (k) não pode ser maior que o tamanho da amostra!",
                        "error3": "Valor do intervalo do Event (k) inválido!",
                  }
            },
            "Results": {
                  "mean": "Média",
                  "var": "Variância",
                  "std": "Desvio Padrão",
                  "coef": "Coeficiente de Variação",
            }
      },
      "Correg": {
            "title": "Correlação e Regressão",
            "x": {
                  "title": "Nome da variável independente",
                  "error": "O Nome da variável independente não pode focar vazio!",
                  "placeholder": "Nome da Xi",
                  "values": {
                        "title": "Valores da variável independente",
                        "error": "Insira algum valor para a Variável independente!"
                  }
            },
            "y": {
                  "title": "Nome da variável dependente",
                  "error": "O Nome da variável dependente não pode focar vazio!",
                  "placeholder": "Nome da Yi",
                  "values": {
                        "title": "Valores da variável dependente",
                        "error": "Insira algum valor para a Variável dependente!"
                  }
            },
            "xyerror": "A quantidade de valores para variável independente e dependente deve ser igual!",
            "csv": {
                  "error1": "Formato de arquivo não compatível, por favor, faça o download do arquivo exemplo (clique em Ajuda) e teste-o primeiro!",
                  "error2": "Há uma célula má formatada em seu arquivo, verifique!",
                  "error3": "Formato de arquivo não compátivel, apenas arquivos .csv são aceitos!"
            },
            "chart": {
                  "title": "Gráfico de Dispersão",
                  "reg": "Linha de Regressão",
            },
            "results": {
                  "acoef": "Coeficiente de Correlação Linear",
                  "eqt": "Equação",
                  "projx": "Projeção de X<sub>i</sub>:",
                  "projy": "Projeção de Y<sub>i</sub>:"
            },
      }
};