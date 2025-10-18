// ===================================
// LADY DAI - LANDING PAGE SCRIPTS
// ===================================

// Smooth scroll para links internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// Header scroll effect
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll <= 0) {
    header.style.boxShadow = 'none';
  } else {
    header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
  }

  lastScroll = currentScroll;
});

// Formatação de telefone
const telefoneInput = document.getElementById('telefone');
if (telefoneInput) {
  telefoneInput.addEventListener('input', function (e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length <= 11) {
      if (value.length <= 2) {
        value = value.replace(/(\d{0,2})/, '($1');
      } else if (value.length <= 6) {
        value = value.replace(/(\d{2})(\d{0,4})/, '($1) $2');
      } else if (value.length <= 10) {
        value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
      } else {
        value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
      }
    }
    
    e.target.value = value;
  });
}

// Validação e envio do formulário
const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
  bookingForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Coletar dados do formulário
    const formData = {
      nome: document.getElementById('nome').value.trim(),
      email: document.getElementById('email').value.trim(),
      telefone: document.getElementById('telefone').value.trim(),
      veiculo: document.getElementById('veiculo').value.trim(),
      servico: document.getElementById('servico').value,
      mensagem: document.getElementById('mensagem').value.trim()
    };

    // Validações básicas
    if (!formData.nome || formData.nome.length < 3) {
      showNotification('Por favor, insira seu nome completo.', 'error');
      return;
    }

    if (!isValidEmail(formData.email)) {
      showNotification('Por favor, insira um e-mail válido.', 'error');
      return;
    }

    if (!formData.telefone || formData.telefone.length < 14) {
      showNotification('Por favor, insira um telefone válido.', 'error');
      return;
    }

    // Criar mensagem para WhatsApp
    const whatsappMessage = criarMensagemWhatsApp(formData);
    const whatsappURL = `https://wa.me/5515981024196?text=${encodeURIComponent(whatsappMessage)}`;

    // Mostrar notificação de sucesso
    showNotification('Redirecionando para o WhatsApp...', 'success');

    // Aguardar um momento e redirecionar
    setTimeout(() => {
      window.open(whatsappURL, '_blank');
      bookingForm.reset();
    }, 1000);
  });
}

// Função para validar e-mail
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Função para criar mensagem do WhatsApp
function criarMensagemWhatsApp(data) {
  let mensagem = `*Novo Agendamento - Lady Dai*\n\n`;
  mensagem += `👤 *Nome:* ${data.nome}\n`;
  mensagem += `📧 *E-mail:* ${data.email}\n`;
  mensagem += `📱 *Telefone:* ${data.telefone}\n`;
  
  if (data.veiculo) {
    mensagem += `🚗 *Veículo:* ${data.veiculo}\n`;
  }
  
  if (data.servico) {
    const servicos = {
      'revisao': 'Revisão Completa',
      'funilaria': 'Funilaria',
      'pintura': 'Pintura',
      'mecanica': 'Mecânica',
      'outros': 'Outros'
    };
    mensagem += `🔧 *Serviço:* ${servicos[data.servico] || data.servico}\n`;
  }
  
  if (data.mensagem) {
    mensagem += `\n💬 *Mensagem:*\n${data.mensagem}\n`;
  }
  
  mensagem += `\n✨ *Promoção Final de Ano - 10% OFF*`;
  
  return mensagem;
}

// Sistema de notificações
function showNotification(message, type = 'info') {
  // Remover notificação existente
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  // Criar nova notificação
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;

  // Estilos inline para a notificação
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    padding: 1rem 1.5rem;
    background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#3B82F6'};
    color: white;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    z-index: 10000;
    font-weight: 600;
    font-size: 0.9375rem;
    animation: slideInRight 0.3s ease-out;
    max-width: 90%;
  `;

  // Adicionar ao body
  document.body.appendChild(notification);

  // Remover após 4 segundos
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, 4000);
}

// Adicionar animações CSS para notificações
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Intersection Observer para animações ao scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observar elementos para animação
document.addEventListener('DOMContentLoaded', () => {
  const animatedElements = document.querySelectorAll(
    '.benefit-card, .service-card, .booking-wrapper, .urgency-content'
  );
  
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
  });
});

// Contador de estatísticas animado
function animateCounter(element, target, duration = 2000) {
  const start = 0;
  const increment = target / (duration / 16);
  let current = start;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target + (element.dataset.suffix || '');
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current) + (element.dataset.suffix || '');
    }
  }, 16);
}

// Animar contadores quando visíveis
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const statNumbers = entry.target.querySelectorAll('.stat-number');
      statNumbers.forEach(stat => {
        const target = parseInt(stat.textContent);
        if (!isNaN(target)) {
          stat.dataset.suffix = stat.textContent.replace(/[0-9]/g, '');
          animateCounter(stat, target);
        }
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
  statsObserver.observe(heroStats);
}

// Prevenção de spam no formulário
let formSubmitted = false;
if (bookingForm) {
  bookingForm.addEventListener('submit', function() {
    if (formSubmitted) {
      showNotification('Aguarde um momento antes de enviar novamente.', 'error');
      return false;
    }
    formSubmitted = true;
    setTimeout(() => {
      formSubmitted = false;
    }, 5000);
  });
}

// Log de carregamento
console.log('🚗 Lady Dai Landing Page carregada com sucesso!');
console.log('📱 Mobile-first design ativo');
console.log('✨ Todos os scripts inicializados');

