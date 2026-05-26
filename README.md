# 🛒 Lista de Compras Dinâmica

Uma aplicação web simples e intuitiva para gerenciar sua lista de compras com persistência de dados usando **LocalStorage**.

## ✨ Funcionalidades

- ✅ **Adicionar itens** - Digite o produto e clique em "Adicionar" ou pressione Enter
- 🗑️ **Remover itens** - Delete itens individuais da lista
- ☑️ **Marcar como concluído** - Marque itens já comprados
- 🔍 **Filtrar itens** - Veja todos, apenas pendentes ou apenas concluídos
- 📊 **Estatísticas** - Acompanhe total de itens e quantos já foram concluídos
- 💾 **Persistência** - Todos os dados são salvos automaticamente no LocalStorage
- 🎨 **Design responsivo** - Funciona perfeitamente em mobile e desktop
- 🧹 **Limpeza rápida** - Remova concluídos ou todos os itens com um clique

## 🚀 Como Usar

1. **Abra o arquivo** `index.html` em um navegador
2. **Digite um produto** no campo de entrada
3. **Clique em "Adicionar"** ou pressione **Enter**
4. **Marque** ☑️ itens conforme os compra
5. **Remova** 🗑️ itens que não precisa mais

## 📁 Arquivos

- `index.html` - Estrutura da aplicação
- `styles.css` - Estilos e design responsivo
- `script.js` - Lógica JavaScript com LocalStorage
- `README.md` - Este arquivo

## 🛠️ Tecnologias

- **HTML5** - Estrutura
- **CSS3** - Estilização (gradientes, animações, flexbox)
- **JavaScript (Vanilla)** - Lógica e LocalStorage
- **LocalStorage** - Persistência de dados no navegador

## 💡 Detalhes Técnicos

### LocalStorage
Os dados são salvos em `JSON` com a chave `shoppingList`:
```json
[
  {
    "id": 1234567890,
    "text": "Leite",
    "completed": false,
    "createdAt": "26/05/2026 10:30:45"
  }
]
```

### Funcionalidades Avançadas
- ✅ Validação de entrada (não permite campos vazios)
- ✅ Limite de 100 caracteres por item
- ✅ Escape de HTML para segurança (XSS prevention)
- ✅ Confirmação antes de deletar itens
- ✅ Animações suaves
- ✅ Scroll customizado

## 📱 Responsividade

A aplicação é totalmente responsiva e se adapta a:
- 📱 Smartphones (320px+)
- 📱 Tablets (768px+)
- 💻 Desktops (1024px+)

## 🎯 Melhorias Futuras

- [ ] Adicionar categorias aos itens
- [ ] Estimar custo total da compra
- [ ] Sincronizar com backend
- [ ] Modo escuro (dark mode)
- [ ] Exportar/importar lista (CSV, JSON)
- [ ] Compartilhar lista com QR Code
- [ ] Histórico de compras anteriores

---

**Desenvolvido com ❤️ para organizar suas compras!**
