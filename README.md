# Nosso Calendario

O nome diz tudo não? =)

## Recursos

- Inicialmente o objetivo é apenas obter os 2 calendarios.
- Depois arranjar forma de ou ligar com algum calendario ja existente ou então de criar o nosso proprio
- Fazer uma ligação mixuruca com o discord ou algo do estilo para ficar mais complexo
- No discord ainda avisar sobre o dia das refeições e se possivel qual refeição quer ser tirada, ainda se possivel tirar diretamente pelo discord.

## Instalação

Para instalar é super simples, basta fazer o clone do projeto
-     npm i
-     node .\run.js

Para a parte de SQL:
    Tabelas:
-        CREATE TABLE events (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255),
            start_date DATETIME,
            end_date DATETIME,
            author VARCHAR(255) DEFAULT 'automatic',
            color VARCHAR(255) DEFAULT 'lightblue'
        );

## Uso

Para usar sei la o que vai ser preciso adicionar depois
