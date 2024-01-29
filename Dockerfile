# Usar a imagem oficial do PostgreSQL como imagem base
FROM postgres:latest

# Definir variáveis de ambiente para o usuário e senha do PostgreSQL
# (Substitua 'seu_usuario' e 'sua_senha' pelos valores desejados)
ENV POSTGRES_USER=admin
ENV POSTGRES_PASSWORD=admin123

# (Opcional) Definir uma variável de ambiente para o nome do seu banco de dados
# Se não definido, o usuário padrão terá um banco de dados com o mesmo nome criado automaticamente
ENV POSTGRES_DB=foodshop_db

# Expor a porta padrão do PostgreSQL (5432)
EXPOSE 5432

# (Opcional) Montar um volume para a persistência de dados
# Isso permite que os dados persistam mesmo quando o contêiner é destruído
# Para usar isso, você precisará criar um volume Docker ou especificar um diretório do host no momento da execução do contêiner
VOLUME ["/var/lib/postgresql/data"]
