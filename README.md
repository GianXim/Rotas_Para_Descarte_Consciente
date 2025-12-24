# Rotas para o descarte consciente 🌲

Autores:
Bernardo Rainha;
Gian Ximenes Verdan Pontes;
Igor Crissaf;
Pietra Nogueira Reis.

### Descrição
Este é um projeto desenvolvido durante o 3º período do curso de engenharia de computação para a disciplina 'ciências do ambiente', o projeto se baseia na ideia de um app para facilitar o descarte correto de resíduos tecnológicos. O aplicativo utiliza geolocalização para conectar cidadãos a pontos de coleta especializados, detalhando quais categorias de materiais (como baterias, monitores ou hardware) cada local está apto a receber, promovendo assim a economia circular e a preservação ambiental.

## Funcionalidades
- 📍 Localização em Tempo Real: Monitoramento da posição do usuário via GPS para exibir os pontos mais próximos.
- 🔍 Busca Inteligente: Sistema de pesquisa que filtra locais por nome, descrição ou tipo de resíduo (ex: pilhas, celulares).
- 🗺️ Mapa Interativo: Visualização de marcadores personalizados para cada ponto de coleta.
- 📋 Detalhamento Completo: Modal informativo contendo fotos do local, responsável e etiquetas (badges) dos materiais aceitos.
- 🚗 Rotas Externas: Integração direta para abrir o destino no aplicativo de mapas padrão do smartphone.
- ☁️ Dados Dinâmicos: Consumo de dados em tempo real através do Google Firebase.

## Tecnologias utilizadas
- React Native.
- Firebase
- React Native Maps

## Como executar o projeto
1. Clone o repositório

   ```bash
   git clone https://github.com/seu-usuario/nome-do-repositorio.git
   ```
2. Instale as dependências

   ```bash
   npm install
   ```
3. Configure o arquivo firebaseConfig.js na pasta App com as suas credenciais
4. Inicie o servidor de desenvolvimento:
      ```bash
   npx expo start
   ```
