# Perplexity Search API - Examples

Esta pasta contém exemplos práticos de como usar a Perplexity Search API em diferentes linguagens de programação.

## Arquivos Disponíveis

### 1. `basic-usage.js`
Exemplos completos em JavaScript/Node.js demonstrando:
- Busca básica
- Busca avançada com parâmetros personalizados
- Busca múltipla
- Verificação de saúde da API
- Obtenção de modelos disponíveis

**Para executar:**
```bash
node examples/basic-usage.js
```

### 2. `python-example.py`
Exemplos equivalentes em Python demonstrando:
- Integração com a biblioteca `requests`
- Tratamento de erros
- Múltiplas buscas com delay
- Formatação de resultados

**Para executar:**
```bash
# Instalar requests primeiro
pip install requests

# Executar exemplo
python examples/python-example.py
```

## Exemplos de Uso por Cenário

### Busca Simples e Rápida

```javascript
const axios = require('axios');

async function quickSearch(query) {
  try {
    const response = await axios.post('http://localhost:3000/api/v1/search', {
      query: query
    });
    return response.data.response;
  } catch (error) {
    console.error('Erro na busca:', error.response?.data || error.message);
  }
}

// Usar
quickSearch('Como funciona inteligência artificial?')
  .then(result => console.log(result));
```

### Busca Acadêmica com Citações

```javascript
async function academicSearch(query) {
  const response = await axios.post('http://localhost:3000/api/v1/search', {
    query: query,
    model: 'llama-3.1-sonar-large-128k-online',
    max_tokens: 2000,
    temperature: 0.1, // Mais factual
    return_citations: true,
    recency_filter: 'year'
  });
  
  return {
    answer: response.data.response,
    sources: response.data.citations
  };
}
```

### Busca Criativa

```javascript
async function creativeSearch(query) {
  const response = await axios.post('http://localhost:3000/api/v1/search', {
    query: query,
    temperature: 0.8, // Mais criativo
    top_p: 0.9,
    max_tokens: 1500
  });
  
  return response.data.response;
}
```

### Sistema de Cache Simples

```javascript
class SearchCache {
  constructor() {
    this.cache = new Map();
    this.maxAge = 30 * 60 * 1000; // 30 minutos
  }
  
  async search(query, options = {}) {
    const key = JSON.stringify({ query, ...options });
    const cached = this.cache.get(key);
    
    if (cached && Date.now() - cached.timestamp < this.maxAge) {
      return cached.data;
    }
    
    const response = await axios.post('http://localhost:3000/api/v1/search', {
      query,
      ...options
    });
    
    this.cache.set(key, {
      data: response.data,
      timestamp: Date.now()
    });
    
    return response.data;
  }
}
```

## Integração com Frameworks Web

### Express.js Middleware

```javascript
const axios = require('axios');

function searchMiddleware(req, res, next) {
  req.search = async (query, options = {}) => {
    try {
      const response = await axios.post('http://localhost:3000/api/v1/search', {
        query,
        ...options
      });
      return response.data;
    } catch (error) {
      throw new Error(`Search failed: ${error.message}`);
    }
  };
  next();
}

// Usar no Express
app.use(searchMiddleware);

app.get('/search/:query', async (req, res) => {
  try {
    const result = await req.search(req.params.query);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### React Hook

```javascript
import { useState, useEffect } from 'react';
import axios from 'axios';

function usePerplexitySearch() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  
  const search = async (query, options = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('http://localhost:3000/api/v1/search', {
        query,
        ...options
      });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return { search, loading, error, result };
}

// Componente React
function SearchComponent() {
  const { search, loading, error, result } = usePerplexitySearch();
  const [query, setQuery] = useState('');
  
  const handleSearch = () => {
    if (query.trim()) {
      search(query);
    }
  };
  
  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Digite sua busca..."
      />
      <button onClick={handleSearch} disabled={loading}>
        {loading ? 'Buscando...' : 'Buscar'}
      </button>
      
      {error && <div className="error">Erro: {error}</div>}
      {result && (
        <div>
          <h3>Resultado:</h3>
          <p>{result.response}</p>
          {result.citations.length > 0 && (
            <div>
              <h4>Fontes:</h4>
              <ul>
                {result.citations.map((citation, index) => (
                  <li key={index}>
                    <a href={citation.url}>{citation.title}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

## Tratamento de Erros Avançado

```javascript
class PerplexityClient {
  constructor(baseURL = 'http://localhost:3000/api/v1') {
    this.baseURL = baseURL;
    this.retryDelays = [1000, 2000, 4000]; // Backoff exponencial
  }
  
  async search(query, options = {}, retryCount = 0) {
    try {
      const response = await axios.post(`${this.baseURL}/search`, {
        query,
        ...options
      });
      return response.data;
    } catch (error) {
      // Rate limiting
      if (error.response?.status === 429 && retryCount < this.retryDelays.length) {
        const delay = this.retryDelays[retryCount];
        console.log(`Rate limited. Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.search(query, options, retryCount + 1);
      }
      
      // Erro específico baseado no status
      switch (error.response?.status) {
        case 400:
          throw new Error(`Parâmetros inválidos: ${error.response.data.error.message}`);
        case 401:
          throw new Error('API key inválida ou não configurada');
        case 500:
          throw new Error('Erro interno do servidor');
        default:
          throw new Error(`Erro na busca: ${error.message}`);
      }
    }
  }
}
```

## Monitoramento e Métricas

```javascript
class SearchAnalytics {
  constructor() {
    this.metrics = {
      totalSearches: 0,
      averageResponseTime: 0,
      errors: 0,
      popularQueries: new Map()
    };
  }
  
  async search(query, options = {}) {
    const startTime = Date.now();
    this.metrics.totalSearches++;
    
    // Rastrear consultas populares
    const count = this.metrics.popularQueries.get(query) || 0;
    this.metrics.popularQueries.set(query, count + 1);
    
    try {
      const response = await axios.post('http://localhost:3000/api/v1/search', {
        query,
        ...options
      });
      
      // Calcular tempo de resposta médio
      const responseTime = Date.now() - startTime;
      this.metrics.averageResponseTime = 
        (this.metrics.averageResponseTime + responseTime) / 2;
      
      return response.data;
    } catch (error) {
      this.metrics.errors++;
      throw error;
    }
  }
  
  getMetrics() {
    return {
      ...this.metrics,
      successRate: ((this.metrics.totalSearches - this.metrics.errors) / 
                   this.metrics.totalSearches * 100).toFixed(2) + '%'
    };
  }
}
```

## Dicas de Performance

1. **Use cache** para consultas repetidas
2. **Implemente retry** com backoff exponencial para rate limiting
3. **Configure timeouts** apropriados para sua aplicação
4. **Monitore usage tokens** para otimizar custos
5. **Use modelos menores** para consultas simples

Para mais exemplos e documentação completa, consulte:
- `../README.md` - Guia completo
- `../docs/API.md` - Documentação técnica da API