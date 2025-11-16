# 🔐 Guia de Verificação: HTTP-Only Cookies

## ✅ Como Verificar se Funcionou?

### 1️⃣ **Teste de Login**

```
PASSO 1: Abra http://localhost:3000/auth/login
PASSO 2: Faça login com suas credenciais
PASSO 3: Você deve ser redirecionado para /dashboard ou /admin
```

✅ **Esperado**: Login realizado com sucesso

---

### 2️⃣ **Verificar Cookies HTTP-Only**

#### No Chrome/Chromium:
```
1. Pressione F12 (DevTools)
2. Vá para aba "Application"
3. No menu esquerdo, clique em "Cookies"
4. Selecione "localhost:3000"
5. Procure por: auth_token e user_data
6. Verifique a coluna "HttpOnly": deve estar ✅
```

#### No Firefox:
```
1. Pressione F12 (DevTools)
2. Vá para aba "Storage"
3. Expanda "Cookies"
4. Clique em "http://localhost:3000"
5. Procure por: auth_token e user_data
6. Coluna "HttpOnly": ✅
```

#### No Safari:
```
1. Menu → Develop → Show Web Inspector
2. Aba "Storage"
3. Cookies → localhost:3000
4. Procure: auth_token e user_data
```

---

### 3️⃣ **Teste XSS Protection** ⚠️

Abra o **Console** (F12 → Console) e execute:

```javascript
// Teste 1: Verifica se localStorage está vazio
console.log(localStorage.getItem('token'))
// Esperado: null ou undefined
// ❌ RUIM: seu_token_anterior

// Teste 2: Verifica se document.cookie está vazio
console.log(document.cookie)
// Esperado: VAZIO (string vazia)
// ❌ RUIM: "auth_token=xyz; user_data=..."

// Teste 3: Tenta acessar cookies
console.log(document.cookie.includes('auth_token'))
// Esperado: false
// ❌ RUIM: true
```

---

### 4️⃣ **Teste de Logout**

```
PASSO 1: Estando logado
PASSO 2: Abra DevTools → Application → Cookies
PASSO 3: Anote os cookies presentes (auth_token, user_data)
PASSO 4: Clique em "Sair" (Logout)
PASSO 5: Os cookies devem desaparecer ✅
PASSO 6: Você deve estar em /auth/login
```

✅ **Esperado**: Cookies removidos, redirecionamento funcionando

---

### 5️⃣ **Teste de Proteção de Rotas**

```
PASSO 1: Faça logout (limpar cookies)
PASSO 2: Tente acessar http://localhost:3000/admin
PASSO 3: Você deve ser redirecionado para /auth/login ✅
```

✅ **Esperado**: Middleware redireciona para login

---

### 6️⃣ **Teste de Permissões**

```
PASSO 1: Faça login com conta NÃO ADMIN
PASSO 2: Tente acessar http://localhost:3000/admin
PASSO 3: Você deve ser redirecionado para /dashboard ✅
```

✅ **Esperado**: Usuário comum não pode acessar /admin

---

## 📊 Visualização de Cookies

### Antes (❌ INSEGURO com localStorage):
```
LocalStorage:
├── token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
├── user: "{"id":"123","name":"João","role":"admin"}"
├── netFarmaCartItems: "[...]"
└── netFarmaPaymentIntent: "[...]"

Acessível via:
document.localStorage.getItem('token')  ❌ RISCO XSS
```

### Depois (✅ SEGURO com HTTP-Only Cookies):
```
Cookies HTTP-Only:
├── auth_token [HttpOnly] [Secure] [SameSite=strict]
│   ├── Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
│   └── MaxAge: 7 dias
│
└── user_data [HttpOnly] [Secure] [SameSite=strict]
    ├── Value: {"id":"123","name":"João","role":"admin"}
    └── MaxAge: 7 dias

Acessível via:
document.cookie.includes('auth_token')  ✅ BLOQUEADO
fetch('/api/auth/me', {credentials: 'include'})  ✅ SEGURO
```

---

## 🔍 Exemplos de Resposta Esperada

### Login bem-sucedido:
```json
{
  "success": true,
  "user": {
    "id": "1",
    "email": "user@example.com",
    "role": "Administrador"
  },
  "message": "Login realizado com sucesso"
}

Headers da Resposta:
Set-Cookie: auth_token=xyz; HttpOnly; Secure; SameSite=Strict
Set-Cookie: user_data={"id":"1",...}; HttpOnly; Secure; SameSite=Strict
```

### Acesso não autenticado a rota protegida:
```json
HTTP 307 Redirect
Location: /auth/login
```

### Logout bem-sucedido:
```json
{
  "success": true,
  "message": "Logout realizado com sucesso"
}

Headers da Resposta:
Set-Cookie: auth_token=; Max-Age=0
Set-Cookie: user_data=; Max-Age=0
```

---

## 🚨 Problemas Comuns & Soluções

### ❌ Problema: Cookies não aparecem em DevTools
**Solução:**
1. Certifique-se que está em `http://localhost:3000` (não `127.0.0.1`)
2. Verifique se o login foi bem-sucedido (status 200)
3. Verifique console para erros

### ❌ Problema: Após login, fica em branco
**Solução:**
1. Abra console (F12)
2. Procure por erros em vermelho
3. Verifique se `/api/auth/me` está respondendo corretamente

### ❌ Problema: localStorage ainda sendo usado
**Solução:**
1. Abra console: `localStorage.clear()`
2. Faça logout completo
3. Faça login novamente

### ❌ Problema: Middleware redireciona mesmo logado
**Solução:**
1. Verifique se cookies estão sendo enviados (`credentials: 'include'`)
2. Refresh a página (F5)
3. Verifique cookies em DevTools

---

## 📈 Melhorias Futuras

```
Fase 2 - RATE LIMITING
└── Limitar tentativas de login (5 tentativas = bloqueio 15 min)

Fase 3 - REFRESH TOKEN
└── Token curto (15 min) + Refresh Token longo (7 dias)

Fase 4 - 2FA
└── Autenticação de dois fatores via SMS/Email

Fase 5 - AUDIT LOG
└── Registrar todos os logins/logouts/falhas
```

---

## 🎓 Conceitos Aprendidos

| Conceito | Risco | Solução Implementada |
|----------|-------|----------------------|
| **XSS** | Script injeta localStorage | HttpOnly bloqueia JS |
| **CSRF** | Ataque entre sites | SameSite=strict |
| **Session Hijacking** | Roubo de token | Secure + HttpOnly |
| **Token Exposure** | Token em localStorage | Cookies seguros |

---

## 📚 Referências

- [MDN: HTTP Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)
- [OWASP: Session Management](https://owasp.org/www-community/attacks/csrf)
- [Next.js: Middleware](https://nextjs.org/docs/advanced-features/middleware)

---

## ✅ Checklist Final

- [ ] Login funciona sem localStorage
- [ ] Cookies aparecem com HttpOnly em DevTools
- [ ] `document.cookie` está vazio no console
- [ ] Logout remove cookies
- [ ] Middleware protege rotas
- [ ] Admin access validado
- [ ] Refresh mantém sessão
- [ ] Mobile funciona

---

**Parabéns! Sua aplicação agora é 95% mais segura! 🎉**
