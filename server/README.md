<h1 align="center"> Plann.er </h1>

<p align="center"> Server para o app de planejamento de viagens com os amigos </p>


<p align="center"> 
    <a href="#-sobre-o-projeto">Projeto</a>&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;
    <a href="#-tecnologias">Tecnologias</a>&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;
    <a href="#-routes">Routes</a>&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;
    <a href="#-licença">Licença</a>&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;
    <a href="#-dicas-para-usar-o-projeto">Dicas de uso</a>
</p>

<p align="center"> 
    <img alt="License" src="https://img.shields.io/static/v1?label=license&message=MIT&color=49AA26&labelColor=000000">
</p>

### 💻 Sobre o projeto

O projeto é um server para montar planos de viagem com amigos, registrar atividades e links úteis.

Tem como objetivo ajudar o usuário a organizar viagens à trabalho ou lazer. O usuário pode criar uma viagem com nome, data de início e fim. Dentro da viagem o usuário pode planejar sua viagem adicionando atividades para realizar em cada dia.

Através do server é possível criar uma viagem e enviar email de confirmação de viagem para o criador da viagem, segue abaixo um exemplo de como será exibido o email

<br>

<p align="center"> 
    <img alt="email for trip confirmation" src=".github/image.png" width="100%">
</p>

### 🚀 Tecnologias

Esse projeto foi desenvolvido com as seguintes tecnologias:

- Python
- Git e Github

### 📍 Routes

#### Create new trip

```http
  POST /trips
```

#### Trip details

```http
  GET /trips/:tripId
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `tripId` | `string` | **Obrigatório**. O ID da viagem |

#### Confirm trip

```http
  GET /trips/:tripId/confirm
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `tripId` | `string` | **Obrigatório**. O ID da viagem |

#### Create trip link

```http
  POST /trips/:tripId/link
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `tripId` | `string` | **Obrigatório**. O ID da viagem |

#### Get trip links

```http
  GET /trips/:tripId/link
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `tripId` | `string` | **Obrigatório**. O ID da viagem |

#### Create a new invite

```http
  POST /trips/:tripId/invites
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `tripId` | `string` | **Obrigatório**. O ID da viagem |

#### Create trip activity

```http
  POST /trips/:tripId/activities
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `tripId` | `string` | **Obrigatório**. O ID da viagem |

#### Get trip activities

```http
  GET /trips/:tripId/activities
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `tripId` | `string` | **Obrigatório**. O ID da viagem |

#### Get the trip participants

```http
  GET /trips/:tripId/participants
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `tripId` | `string` | **Obrigatório**. O ID da viagem |

#### Get the owner trip participant confirm status for trip

```http
  PATCH /participants/:participantId/confirm
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `participantId` | `string` | **Obrigatório**. O ID do criador da viagem |

#### 🚧 Working on
- [ ] Update trip (`PUT /trips/:id`);

### 📜 Licença

Esse projeto está sob a licença MIT.

### 💡 Dicas para usar o projeto

Instalar um ambiente virtual

```bash
  pip3 install virtualenv
```

Criar um ambiente virtual

```bash
  python -m venv venv
```

```bash
  python3 -m venv venv
```

Entrar no ambiente virtual

```bash
  server\venv\Scripts\activate  
```

Instalar as dependencias no ambiente virtual

```bash
  pip3 install Flask  
```
```bash
  pip3 install pytest  
```
```bash
  pip3 install requests  
```

Rodar todos os testes no ambiente virtual

```bash
  pytest   
```

Rodar testes de um arquivo especifico no ambiente virtual

```bash
  pytest -s -v src/models/repositories/nome_do_arquivo_test.py  
```

Gerar email no ambiente virtual para uso no arquivo `src/drivers/email_sender.py`

```bash
  python3 create_email.py   
```

Rodar o servidor no ambiente virtual

```bash
  python run.py  
```
```bash
  python3 run.py  
```

Sair do modo ambiente virtual

```bash
  deactivate  
```

---

Projeto feito através de uma aula da rocketseat. Alterado e adicionado algumas funcionalidades por KetCode.