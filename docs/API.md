# API Documentation

## Perplexity Search API

Esta documentação descreve todos os endpoints, parâmetros e exemplos de uso da Perplexity Search API.

## Base URL

```
http://localhost:3000/api/v1
```

## Autenticação

A API requer uma chave de API da Perplexity AI configurada no servidor. Não é necessária autenticação adicional por parte do cliente.

## Endpoints

### 1. POST /search

Realiza uma busca inteligente usando a Perplexity AI.

**Parâmetros do Body (JSON):**

| Campo | Tipo | Obrigatório | Padrão | Descrição |
|-------|------|-------------|---------|-----------|
| `query` | string | ✅ | - | Consulta de busca (1-1000 caracteres) |
| `model` | string | ❌ | `llama-3.1-sonar-small-128k-online` | Modelo de IA |
| `max_tokens` | integer | ❌ | `1000` | Máximo de tokens (1-4000) |
| `temperature` | float | ❌ | `0.2` | Criatividade (0.0-2.0) |
| `top_p` | float | ❌ | `0.9` | Diversidade (0.0-1.0) |
| `return_citations` | boolean | ❌ | `true` | Incluir citações |
| `return_images` | boolean | ❌ | `false` | Incluir imagens |
| `recency_filter` | string | ❌ | `month` | Filtro temporal |

**Exemplo de Requisição:**

```json
{
  "query": "What is quantum computing?",
  "model": "llama-3.1-sonar-large-128k-online",
  "max_tokens": 1500,
  "temperature": 0.1,
  "return_citations": true,
  "recency_filter": "week"
}
```

**Exemplo de Resposta (200):**

```json
{
  "success": true,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "query": "What is quantum computing?",
  "response": "Quantum computing is a revolutionary approach to computation...",
  "citations": [
    {
      "url": "https://example.com/quantum-computing",
      "title": "Introduction to Quantum Computing",
      "text": "Quantum computing leverages..."
    }
  ],
  "images": [],
  "model_used": "llama-3.1-sonar-large-128k-online",
  "usage": {
    "prompt_tokens": 25,
    "completion_tokens": 450,
    "total_tokens": 475
  }
}
```

### 2. GET /search/models

Lista todos os modelos disponíveis da Perplexity AI.

**Parâmetros:** Nenhum

**Exemplo de Resposta (200):**

```json
{
  "success": true,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "data": [
    {
      "id": "llama-3.1-sonar-small-128k-online",
      "object": "model",
      "created": 1642550000,
      "owned_by": "perplexity"
    },
    {
      "id": "llama-3.1-sonar-large-128k-online",
      "object": "model", 
      "created": 1642550000,
      "owned_by": "perplexity"
    }
  ]
}
```

### 3. GET /search/health

Verifica a saúde da API e conectividade com a Perplexity AI.

**Parâmetros:** Nenhum

**Exemplo de Resposta (200):**

```json
{
  "success": true,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "perplexity_api": {
    "status": "connected",
    "url": "https://api.perplexity.ai"
  }
}
```

### 4. GET /search/stats

Obtém estatísticas de uso e informações do servidor.

**Parâmetros:** Nenhum

**Exemplo de Resposta (200):**

```json
{
  "success": true,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "stats": {
    "server_uptime": 3600,
    "memory_usage": {
      "rss": 45678900,
      "heapTotal": 18874368,
      "heapUsed": 12345678,
      "external": 1234567
    },
    "node_version": "v18.17.0",
    "api_version": "v1"
  }
}
```

## Códigos de Status HTTP

| Código | Descrição |
|--------|-----------|
| `200` | Sucesso |
| `400` | Erro de validação ou parâmetros inválidos |
| `401` | Chave de API inválida ou não configurada |
| `429` | Rate limit excedido |
| `500` | Erro interno do servidor |

## Tratamento de Erros

Todos os erros seguem o formato padrão:

```json
{
  "error": {
    "message": "Descrição do erro",
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

## Rate Limiting

- **Limite:** 100 requisições por 15 minutos por IP
- **Headers de resposta:**
  - `X-RateLimit-Limit`: Limite máximo
  - `X-RateLimit-Remaining`: Requisições restantes
  - `X-RateLimit-Reset`: Timestamp de reset

## Modelos Disponíveis

### Online Models (com acesso à web)

1. **llama-3.1-sonar-small-128k-online**
   - Modelo rápido e eficiente
   - Melhor para consultas simples
   - Menor custo

2. **llama-3.1-sonar-large-128k-online**
   - Modelo mais avançado
   - Melhor para consultas complexas
   - Maior precisão

### Chat Models (sem acesso à web)

1. **llama-3.1-sonar-small-128k-chat**
   - Modelo de chat rápido
   - Baseado em conhecimento interno

2. **llama-3.1-sonar-large-128k-chat**
   - Modelo de chat avançado
   - Maior contexto e precisão

## Filtros de Recência

| Filtro | Descrição |
|--------|-----------|
| `hour` | Informações da última hora |
| `day` | Informações do último dia |
| `week` | Informações da última semana |
| `month` | Informações do último mês |
| `year` | Informações do último ano |

## Parâmetros Avançados

### Temperature

Controla a criatividade e aleatoriedade das respostas:
- `0.0-0.3`: Respostas mais focadas e determinísticas
- `0.4-0.7`: Balanceamento entre criatividade e precisão
- `0.8-2.0`: Respostas mais criativas e variadas

### Top-P

Controla a diversidade do vocabulário:
- `0.1-0.5`: Vocabulário mais restrito
- `0.6-0.9`: Vocabulário balanceado (recomendado)
- `0.9-1.0`: Vocabulário mais amplo

## Melhores Práticas

1. **Otimização de Consultas:**
   - Use consultas específicas e claras
   - Inclua contexto quando necessário
   - Evite consultas muito genéricas

2. **Parâmetros:**
   - Use `temperature` baixo para informações factuais
   - Use `temperature` alto para conteúdo criativo
   - Configure `max_tokens` baseado na resposta esperada

3. **Rate Limiting:**
   - Implemente retry com backoff exponencial
   - Monitore headers de rate limit
   - Cache respostas quando apropriado

4. **Error Handling:**
   - Trate todos os códigos de erro
   - Implemente fallbacks para falhas de API
   - Log erros para monitoramento

## Exemplos Completos

### cURL

```bash
# Busca básica
curl -X POST http://localhost:3000/api/v1/search \
  -H "Content-Type: application/json" \
  -d '{"query": "Latest AI developments"}'

# Busca avançada
curl -X POST http://localhost:3000/api/v1/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Machine learning applications in healthcare",
    "model": "llama-3.1-sonar-large-128k-online",
    "max_tokens": 2000,
    "temperature": 0.1,
    "return_citations": true,
    "recency_filter": "month"
  }'
```

### JavaScript/Node.js

```javascript
const axios = require('axios');

async function searchWithRetry(query, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await axios.post('http://localhost:3000/api/v1/search', {
        query,
        return_citations: true
      });
      
      return response.data;
    } catch (error) {
      if (error.response?.status === 429 && i < maxRetries - 1) {
        // Rate limit hit, wait and retry
        const waitTime = Math.pow(2, i) * 1000; // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      throw error;
    }
  }
}
```

### Python

```python
import requests
import time

def search_with_retry(query, max_retries=3):
    for attempt in range(max_retries):
        try:
            response = requests.post(
                'http://localhost:3000/api/v1/search',
                json={'query': query, 'return_citations': True}
            )
            
            if response.status_code == 200:
                return response.json()
            elif response.status_code == 429 and attempt < max_retries - 1:
                # Rate limit hit, wait and retry
                wait_time = (2 ** attempt)
                time.sleep(wait_time)
                continue
            else:
                response.raise_for_status()
                
        except requests.exceptions.RequestException as e:
            if attempt == max_retries - 1:
                raise e
            time.sleep(2 ** attempt)
```

## Monitoramento

### Health Checks

Recomenda-se verificar regularmente:

```bash
# Status geral
curl http://localhost:3000/health

# Status da Perplexity API
curl http://localhost:3000/api/v1/search/health

# Estatísticas do sistema
curl http://localhost:3000/api/v1/search/stats
```

### Logs

Os logs são organizados por níveis:
- `error`: Apenas erros críticos
- `warn`: Avisos e problemas não críticos
- `info`: Informações gerais de operação
- `debug`: Informações detalhadas para debug

### Métricas Importantes

- Tempo de resposta médio
- Taxa de sucesso/erro
- Uso de tokens
- Rate limit hits
- Uptime do servidor