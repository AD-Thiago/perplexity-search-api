# Perplexity Search API

API de busca inteligente usando Perplexity AI para desenvolvimento de sistema de pesquisa avançado com recursos de IA.

## 🚀 Características

- **Busca Inteligente**: Integração com Perplexity AI para resultados precisos e atualizados
- **REST API**: Endpoints RESTful para fácil integração
- **Múltiplos Modelos**: Suporte a diferentes modelos de IA da Perplexity
- **Citações e Fontes**: Respostas com citações e fontes verificáveis
- **Rate Limiting**: Proteção contra uso excessivo
- **Logging Completo**: Sistema de logs para monitoramento e debugging
- **Validação de Entrada**: Validação robusta de parâmetros de busca
- **Documentação Completa**: API bem documentada com exemplos

## 📋 Requisitos

- Node.js 16+ 
- npm ou yarn
- Chave de API da Perplexity AI

## ⚡ Instalação Rápida

1. **Clone o repositório**:
```bash
git clone https://github.com/AD-Thiago/perplexity-search-api.git
cd perplexity-search-api
```

2. **Instale as dependências**:
```bash
npm install
```

3. **Configure as variáveis de ambiente**:
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

4. **Inicie o servidor**:
```bash
npm start
# ou para desenvolvimento:
npm run dev
```

## 🔧 Configuração

### Variáveis de Ambiente

Copie `.env.example` para `.env` e configure:

```env
# Perplexity AI Configuration
PERPLEXITY_API_KEY=your_perplexity_api_key_here
PERPLEXITY_API_URL=https://api.perplexity.ai

# Server Configuration
PORT=3000
NODE_ENV=development

# API Configuration
API_VERSION=v1
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging Configuration
LOG_LEVEL=info
```

### Obtenção da Chave de API

1. Visite [Perplexity AI](https://www.perplexity.ai/)
2. Crie uma conta ou faça login
3. Vá para as configurações de API
4. Gere uma nova chave de API
5. Adicione a chave no arquivo `.env`

## 📚 Uso da API

### Endpoints Disponíveis

| Método | Endpoint | Descrição |
|---------|----------|-----------|
| POST | `/api/v1/search` | Realizar busca inteligente |
| GET | `/api/v1/search/models` | Listar modelos disponíveis |
| GET | `/api/v1/search/health` | Verificar status da API |
| GET | `/api/v1/search/stats` | Obter estatísticas de uso |
| GET | `/health` | Health check geral |

### 1. Busca Básica

```bash
curl -X POST http://localhost:3000/api/v1/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What are the latest developments in artificial intelligence?"
  }'
```

**Resposta**:
```json
{
  "success": true,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "query": "What are the latest developments in artificial intelligence?",
  "response": "Based on recent developments...",
  "citations": [...],
  "images": [],
  "model_used": "llama-3.1-sonar-small-128k-online",
  "usage": {
    "prompt_tokens": 45,
    "completion_tokens": 256,
    "total_tokens": 301
  }
}
```

### 2. Busca Avançada

```bash
curl -X POST http://localhost:3000/api/v1/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Explain quantum computing applications",
    "model": "llama-3.1-sonar-large-128k-online",
    "max_tokens": 1500,
    "temperature": 0.1,
    "return_citations": true,
    "return_images": true,
    "recency_filter": "week"
  }'
```

### 3. Modelos Disponíveis

```bash
curl -X GET http://localhost:3000/api/v1/search/models
```

### 4. Status da API

```bash
curl -X GET http://localhost:3000/api/v1/search/health
```

## 🔧 Parâmetros de Busca

| Parâmetro | Tipo | Obrigatório | Padrão | Descrição |
|-----------|------|-------------|---------|-----------|
| `query` | string | ✅ | - | Consulta de busca |
| `model` | string | ❌ | `llama-3.1-sonar-small-128k-online` | Modelo de IA a usar |
| `max_tokens` | number | ❌ | `1000` | Máximo de tokens na resposta |
| `temperature` | number | ❌ | `0.2` | Controle de criatividade (0-2) |
| `top_p` | number | ❌ | `0.9` | Controle de diversidade (0-1) |
| `return_citations` | boolean | ❌ | `true` | Incluir citações |
| `return_images` | boolean | ❌ | `false` | Incluir imagens |
| `recency_filter` | string | ❌ | `month` | Filtro de recência |

### Modelos Disponíveis

- `llama-3.1-sonar-small-128k-online` - Modelo rápido com acesso à web
- `llama-3.1-sonar-large-128k-online` - Modelo avançado com acesso à web
- `llama-3.1-sonar-small-128k-chat` - Modelo de chat rápido
- `llama-3.1-sonar-large-128k-chat` - Modelo de chat avançado

### Filtros de Recência

- `hour` - Última hora
- `day` - Último dia
- `week` - Última semana
- `month` - Último mês
- `year` - Último ano

## 💻 Exemplos de Código

### JavaScript/Node.js

```javascript
const axios = require('axios');

async function searchPerplexity(query) {
  try {
    const response = await axios.post('http://localhost:3000/api/v1/search', {
      query: query,
      model: 'llama-3.1-sonar-large-128k-online',
      max_tokens: 1000,
      return_citations: true
    });
    
    console.log('Result:', response.data.response);
    console.log('Citations:', response.data.citations);
  } catch (error) {
    console.error('Error:', error.response.data);
  }
}

searchPerplexity('How does machine learning work?');
```

### Python

```python
import requests
import json

def search_perplexity(query):
    url = 'http://localhost:3000/api/v1/search'
    data = {
        'query': query,
        'model': 'llama-3.1-sonar-large-128k-online',
        'max_tokens': 1000,
        'return_citations': True
    }
    
    try:
        response = requests.post(url, json=data)
        result = response.json()
        
        print(f"Result: {result['response']}")
        print(f"Citations: {len(result['citations'])}")
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")

search_perplexity('How does machine learning work?')
```

### cURL

```bash
# Busca básica
curl -X POST http://localhost:3000/api/v1/search \
  -H "Content-Type: application/json" \
  -d '{"query": "Latest AI trends 2024"}'

# Busca com parâmetros avançados
curl -X POST http://localhost:3000/api/v1/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Climate change solutions",
    "model": "llama-3.1-sonar-large-128k-online",
    "max_tokens": 1500,
    "temperature": 0.1,
    "return_images": true,
    "recency_filter": "month"
  }'
```

## 🔒 Segurança e Rate Limiting

- **Rate Limiting**: 100 requisições por 15 minutos por IP
- **Helmet**: Headers de segurança automáticos
- **CORS**: Configuração flexível de CORS
- **Validação**: Validação rigorosa de entrada
- **Logging**: Log completo de requisições e erros

## 📊 Monitoramento

### Logs

Os logs são salvos em:
- `logs/error.log` - Apenas erros
- `logs/combined.log` - Todos os logs
- Console (desenvolvimento)

### Health Checks

```bash
# Health check geral
curl http://localhost:3000/health

# Health check da Perplexity API
curl http://localhost:3000/api/v1/search/health

# Estatísticas do servidor
curl http://localhost:3000/api/v1/search/stats
```

## 🧪 Testando a API

Execute os exemplos incluídos:

```bash
# Instalar axios para os exemplos
npm install

# Executar exemplos básicos
node examples/basic-usage.js
```

## 🛠️ Desenvolvimento

### Scripts Disponíveis

```bash
npm start          # Iniciar servidor de produção
npm run dev        # Iniciar servidor de desenvolvimento
npm test           # Executar testes
npm run lint       # Verificar código
npm run lint:fix   # Corrigir problemas de lint
```

### Estrutura do Projeto

```
perplexity-search-api/
├── src/
│   ├── config/          # Configurações (logger, etc)
│   ├── controllers/     # Controladores da API
│   ├── middleware/      # Middlewares (validação, erro, etc)
│   ├── routes/          # Definições de rotas
│   ├── services/        # Serviços (Perplexity AI)
│   ├── utils/           # Utilitários e helpers
│   └── server.js        # Servidor principal
├── examples/            # Exemplos de uso
├── docs/               # Documentação adicional
├── logs/               # Arquivos de log
└── package.json        # Dependências e scripts
```

## 🚨 Tratamento de Erros

A API retorna erros estruturados:

```json
{
  "error": {
    "message": "Validation failed",
    "status": 400,
    "timestamp": "2024-01-15T10:30:00.000Z",
    "details": [
      {
        "field": "query",
        "message": "Query is required"
      }
    ]
  }
}
```

### Códigos de Status HTTP

- `200` - Sucesso
- `400` - Erro de validação ou parâmetros inválidos
- `401` - API key inválida
- `429` - Rate limit excedido
- `500` - Erro interno do servidor

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📞 Suporte

- **Issues**: [GitHub Issues](https://github.com/AD-Thiago/perplexity-search-api/issues)
- **Documentação**: [API Documentation](docs/)
- **Exemplos**: [Examples Directory](examples/)

## 🔗 Links Úteis

- [Perplexity AI Documentation](https://docs.perplexity.ai/)
- [Express.js Documentation](https://expressjs.com/)
- [Node.js Documentation](https://nodejs.org/docs/)

---

**Desenvolvido com ❤️ por [AD-Thiago](https://github.com/AD-Thiago)**
