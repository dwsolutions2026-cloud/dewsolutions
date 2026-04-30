export function generateWhatsAppLink(numero: string, template: string, data: any) {
  let message = template;
  
  const variables: Record<string, string> = {
    nome_empresa: data.nome_empresa || '',
    nome_responsavel: data.nome_responsavel || '',
    email: data.email || '',
    telefone: data.telefone || '',
    cargo_vaga: data.cargo_vaga || '',
    cidade: data.cidade || '',
    mensagem: data.mensagem || ''
  };

  Object.entries(variables).forEach(([key, value]) => {
    message = message.replace(new RegExp(`{${key}}`, 'g'), value);
  });

  const encodedMessage = encodeURIComponent(message);
  const cleanNumber = numero.replace(/\D/g, '');
  
  // Se o número não começar com 55 e tiver 10 ou 11 dígitos, adicionamos 55
  const finalNumber = (cleanNumber.length <= 11 && !cleanNumber.startsWith('55')) 
    ? `55${cleanNumber}` 
    : cleanNumber;

  return `https://wa.me/${finalNumber}?text=${encodedMessage}`;
}
