# 📌 README - MOBILE

<h1 align="center">
📱 Aplicação Mobile - Expo + React Native
</h1>

<p align="center">
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" height="40" />
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" height="40" />
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg" height="40" />
</p>

------------------------------------------------------------------------

## 📋 Visão Geral

Aplicação **Mobile** desenvolvida com **Expo + React Native**,
consumindo uma **API GraphQL** construída em NestJS.

O projeto utiliza:

-   Expo Router\
-   Apollo Client\
-   GraphQL Codegen\
-   React Hook Form + Zod\
-   NativeWind (Tailwind CSS)\
-   ESLint e Prettier

Funcionalidades:

-   Registro de usuários\
-   Login\
-   Listagem e busca de usuários\
-   Logout

------------------------------------------------------------------------

## 📁 Estrutura do Projeto

``` bash
app/
├── _layout.tsx
├── (auth)/
│   ├── login.tsx
│   └── signup.tsx
├── (app)/
│   └── index.tsx

src/
├── generated/
├── graphql/
├── lib/
├── schemas/
├── screens/
```

------------------------------------------------------------------------

## 🚀 Tecnologias Utilizadas

-   React Native\
-   Expo\
-   Expo Router\
-   NativeWind\
-   TypeScript\
-   GraphQL\
-   Apollo Client\
-   GraphQL Codegen\
-   React Hook Form\
-   Zod\
-   ESLint\
-   Prettier

------------------------------------------------------------------------

## ⚙️ Variáveis de Ambiente

``` bash
EXPO_PUBLIC_GRAPHQL_URL=https://api-ruk-deploy-production.up.railway.app/graphql
```

------------------------------------------------------------------------

## 🧪 Como Executar

``` bash
npm install
npm run codegen
npx expo start
```

------------------------------------------------------------------------

## 📫 Contato

- GitHub: https://github.com/LuizDelgado\
- LinkedIn: https://linkedin.com/in/luiz-delgado
