'use client';

import { useState, useEffect, useRef } from 'react';
import { useCart } from '@/app/context/cart-context';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft, ChevronDown, Search, User, MapPin, Phone, Clock, Navigation, Loader2, X, Copy, Check } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function CheckoutForm() {
  const { items, total, itemCount, clearCart } = useCart();
  const router = useRouter();
  const addressFormRef = useRef<HTMLDivElement>(null);
  
  const [step, setStep] = useState(1); // 1: Identificação, 2: Revisão, 3: Pagamento
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showCart, setShowCart] = useState(false);
  
  // Form data
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [cep, setCep] = useState('');
  const [address, setAddress] = useState('');
  const [number, setNumber] = useState('');
  const [noNumber, setNoNumber] = useState(false);
  const [complement, setComplement] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('PIX');
  const [change, setChange] = useState('');
  const [cpf, setCpf] = useState('');
  const [gettingLocation, setGettingLocation] = useState(false);
  
  // Coordenadas do mapa
  const [mapCoords, setMapCoords] = useState<{lat: number, lng: number} | null>(null);
  
  // PIX states
  const [showCardPopup, setShowCardPopup] = useState(false);
  const [generatingPix, setGeneratingPix] = useState(false);
  const [pixData, setPixData] = useState<{qrCode: string; copyPaste: string; expiresAt: string} | null>(null);
  const [copied, setCopied] = useState(false);
  
  // Card states
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  
  const deliveryFee = total >= 20 ? 0 : 5;
  const finalTotal = total + deliveryFee;
  
  // Calcular economia (soma dos descontos)
  const savings = items.reduce((acc, item) => {
    // Assumindo que o preço original era ~20% maior para itens em oferta
    const originalPrice = item.price * 1.2;
    return acc + ((originalPrice - item.price) * item.quantity);
  }, 0);

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return `(${numbers}`;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    if (formatted.replace(/\D/g, '').length <= 11) {
      setPhone(formatted);
    }
  };

  // Função para scroll suave até o formulário de endereço
  const scrollToAddressForm = () => {
    setTimeout(() => {
      addressFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const fetchAddressByCep = async (cepValue: string) => {
    const cleanCep = cepValue.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setAddress(data.logradouro || '');
          setNeighborhood(data.bairro || '');
          setCity(data.localidade || '');
          setState(data.uf || '');
          setShowAddressForm(true);
          toast.success('Endereço encontrado!');
          scrollToAddressForm();
          
          // Buscar coordenadas pelo endereço
          const searchQuery = `${data.logradouro}, ${data.bairro}, ${data.localidade}, ${data.uf}, Brazil`;
          try {
            const geoRes = await fetch(
              `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`
            );
            const geoData = await geoRes.json();
            if (geoData && geoData.length > 0) {
              setMapCoords({
                lat: parseFloat(geoData[0].lat),
                lng: parseFloat(geoData[0].lon)
              });
            }
          } catch (geoError) {
            console.error('Erro ao buscar coordenadas:', geoError);
          }
        } else {
          toast.error('CEP não encontrado');
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        toast.error('Erro ao buscar CEP');
      }
    }
  };

  const handleGetLocation = () => {
    setGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            // Salvar coordenadas REAIS da pessoa
            setMapCoords({ lat: latitude, lng: longitude });
            
            // Usar API do Google para geocodificação reversa (mais precisa)
            // Fallback para Nominatim se Google falhar
            let addressData = null;
            
            // Tentar com Nominatim primeiro (zoom máximo para maior precisão)
            try {
              const nominatimRes = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=19&addressdetails=1&accept-language=pt-BR`,
                { headers: { 'User-Agent': 'ZePedidosApp/1.0' } }
              );
              const nominatimData = await nominatimRes.json();
              if (nominatimData.address) {
                addressData = {
                  road: nominatimData.address.road || nominatimData.address.street || nominatimData.address.pedestrian || '',
                  number: nominatimData.address.house_number || '',
                  neighborhood: nominatimData.address.suburb || nominatimData.address.neighbourhood || nominatimData.address.district || nominatimData.address.quarter || '',
                  city: nominatimData.address.city || nominatimData.address.town || nominatimData.address.municipality || nominatimData.address.village || '',
                  state: nominatimData.address.state || '',
                  postcode: nominatimData.address.postcode || ''
                };
              }
            } catch (e) {
              console.error('Nominatim falhou:', e);
            }
            
            // Se não encontrou endereço ou CEP, tenta buscar CEP via coordenadas na API brasileira
            if (addressData && !addressData.postcode) {
              try {
                const cepRes = await fetch(
                  `https://cep.awesomeapi.com.br/json/cep/${latitude},${longitude}`
                );
                const cepData = await cepRes.json();
                if (cepData.cep) {
                  addressData.postcode = cepData.cep;
                  // Atualiza outros campos se disponíveis
                  if (!addressData.road && cepData.address) addressData.road = cepData.address;
                  if (!addressData.neighborhood && cepData.district) addressData.neighborhood = cepData.district;
                  if (!addressData.city && cepData.city) addressData.city = cepData.city;
                  if (!addressData.state && cepData.state) addressData.state = cepData.state;
                }
              } catch (e) {
                console.error('API CEP falhou:', e);
              }
            }
            
            // Se temos um CEP, validar/completar com ViaCEP para garantir dados corretos
            if (addressData?.postcode) {
              const cleanCep = addressData.postcode.replace(/\D/g, '');
              if (cleanCep.length === 8) {
                try {
                  const viaCepRes = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
                  const viaCepData = await viaCepRes.json();
                  if (!viaCepData.erro) {
                    // ViaCEP tem dados mais precisos para Brasil
                    if (viaCepData.logradouro) addressData.road = viaCepData.logradouro;
                    if (viaCepData.bairro) addressData.neighborhood = viaCepData.bairro;
                    if (viaCepData.localidade) addressData.city = viaCepData.localidade;
                    if (viaCepData.uf) addressData.state = viaCepData.uf;
                  }
                } catch (e) {
                  console.error('ViaCEP validação falhou:', e);
                }
              }
            }
            
            if (addressData) {
              setAddress(addressData.road);
              setNeighborhood(addressData.neighborhood);
              setNumber(addressData.number);
              setCity(addressData.city);
              setState(addressData.state);
              setCep(addressData.postcode?.replace(/\D/g, '') || '');
              setShowAddressForm(true);
              
              if (addressData.road && addressData.postcode) {
                toast.success('Endereço encontrado! Verifique os dados.');
              } else {
                toast.success('Localização obtida. Complete o endereço.');
              }
              scrollToAddressForm();
            } else {
              toast.error('Não foi possível obter o endereço. Digite manualmente.');
              setShowAddressForm(true);
              scrollToAddressForm();
            }
          } catch (error) {
            console.error('Erro ao obter endereço:', error);
            toast.error('Erro ao obter endereço. Tente novamente.');
          }
          setGettingLocation(false);
        },
        (error) => {
          console.error('Erro geolocalização:', error);
          if (error.code === 1) {
            toast.error('Permissão de localização negada. Ative nas configurações do navegador.');
          } else if (error.code === 2) {
            toast.error('Não foi possível obter sua localização. Verifique o GPS.');
          } else {
            toast.error('Tempo esgotado. Tente novamente.');
          }
          setGettingLocation(false);
        },
        { 
          enableHighAccuracy: true, 
          timeout: 20000, 
          maximumAge: 0 
        }
      );
    } else {
      toast.error('Seu navegador não suporta geolocalização');
      setGettingLocation(false);
    }
  };

  const handleManualAddress = () => {
    setShowAddressForm(true);
    scrollToAddressForm();
  };

  // Ao clicar em Cartão de Crédito - mostra popup e redireciona para PIX
  const handleCardClick = () => {
    setShowCardPopup(true);
    setTimeout(() => {
      setShowCardPopup(false);
      setPaymentMethod('PIX');
    }, 5000);
  };

  // Gerar PIX via API
  const handleGeneratePix = async () => {
    if (!isValidCPF(cpf)) {
      toast.error('CPF inválido. Digite um CPF real.');
      return;
    }

    setGeneratingPix(true);
    
    try {
      const response = await fetch('/api/payment/pix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: finalTotal,
          customerName: name,
          customerCpf: cpf,
          items: items.map(item => ({
            title: item.name,
            unitPrice: item.price,
            quantity: item.quantity
          }))
        })
      });

      const data = await response.json();

      if (data.success) {
        setPixData({
          qrCode: data.pixQrCode,
          copyPaste: data.pixCopyPaste,
          expiresAt: data.expiresAt
        });
      } else {
        toast.error(data.error || 'Erro ao gerar PIX');
      }
    } catch (error) {
      console.error('Erro ao gerar PIX:', error);
      toast.error('Erro ao conectar com o gateway de pagamento');
    } finally {
      setGeneratingPix(false);
    }
  };

  // Copiar código PIX
  const copyToClipboard = async () => {
    if (pixData?.copyPaste) {
      try {
        await navigator.clipboard.writeText(pixData.copyPaste);
        setCopied(true);
        toast.success('Código copiado!');
        setTimeout(() => setCopied(false), 3000);
      } catch {
        toast.error('Erro ao copiar');
      }
    }
  };

  // Validação de CPF real (algoritmo oficial)
  const isValidCPF = (val: string): boolean => {
    const clean = val.replace(/\D/g, '');
    if (clean.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(clean)) return false;
    let sum = 0;
    for (let i = 0; i < 9; i++) sum += parseInt(clean.charAt(i)) * (10 - i);
    let rem = (sum * 10) % 11;
    if (rem === 10) rem = 0;
    if (rem !== parseInt(clean.charAt(9))) return false;
    sum = 0;
    for (let i = 0; i < 10; i++) sum += parseInt(clean.charAt(i)) * (11 - i);
    rem = (sum * 10) % 11;
    if (rem === 10) rem = 0;
    if (rem !== parseInt(clean.charAt(10))) return false;
    return true;
  };

  // Validação de nome real
  const isValidName = (val: string): { ok: boolean; msg?: string } => {
    const t = val.trim();
    if (t.length < 3) return { ok: false, msg: 'Nome muito curto' };
    const parts = t.split(/\s+/).filter(Boolean);
    if (parts.length < 2) return { ok: false, msg: 'Digite nome e sobrenome' };
    if (parts.some(p => p.length < 2)) return { ok: false, msg: 'Nome inválido' };
    if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(t)) return { ok: false, msg: 'Nome não pode conter números ou símbolos' };
    return { ok: true };
  };

  // Validação de telefone real
  const isValidPhone = (val: string): boolean => {
    const clean = val.replace(/\D/g, '');
    if (clean.length < 10 || clean.length > 11) return false;
    const ddd = parseInt(clean.substring(0, 2));
    if (ddd < 11 || ddd > 99) return false;
    if (clean.length === 11 && clean.charAt(2) !== '9') return false;
    return true;
  };

  const handleContinue = () => {
    if (step === 1) {
      // Validar nome real
      const nameResult = isValidName(name);
      if (!nameResult.ok) {
        toast.error(nameResult.msg || 'Nome inválido');
        return;
      }
      // Validar telefone real
      if (!isValidPhone(phone)) {
        toast.error('Telefone inválido. Use DDD + número (ex: 11 99999-9999)');
        return;
      }
      if (!address.trim()) {
        toast.error('Preencha o endereço');
        return;
      }
      if (!noNumber && !number.trim()) {
        toast.error('Preencha o número ou marque "Sem número"');
        return;
      }
      if (!neighborhood.trim()) {
        toast.error('Preencha o bairro');
        return;
      }
      setStep(2); // Vai para Revisão
    } else if (step === 2) {
      setStep(3); // Vai para Pagamento
    } else if (step === 3) {
      if (!paymentMethod) {
        toast.error('Selecione a forma de pagamento');
        return;
      }
      handleSubmit();
    }
  };
  
  const handleClearCart = () => {
    clearCart();
    router.push('/');
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const numberStr = noNumber ? 'S/N' : number;
      const fullAddress = `${address}, ${numberStr}${complement ? ` - ${complement}` : ''} - ${neighborhood}${city ? ` - ${city}` : ''}`;
      
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: name,
          customerPhone: phone,
          address: fullAddress,
          paymentMethod,
          change: paymentMethod === 'Dinheiro' ? change : null,
          subtotal: total,
          deliveryFee,
          total: finalTotal,
          items: items.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        }),
      });

      if (response.ok) {
        setSuccess(true);
        clearCart();
        toast.success('Pedido enviado com sucesso!');
      } else {
        throw new Error('Erro ao enviar pedido');
      }
    } catch (error) {
      toast.error('Erro ao enviar pedido. Tente novamente.');
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Pedido Confirmado!</h1>
          <p className="text-gray-600 mb-6">Em breve você receberá seu pedido.</p>
          <Link
            href="/"
            className="inline-block bg-[#F7B731] text-white font-bold py-3 px-8 rounded-xl"
          >
            Voltar ao Início
          </Link>
        </div>
      </div>
    );
  }

  if (itemCount === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-900 mb-2">Carrinho vazio</h1>
          <p className="text-gray-600 mb-6">Adicione produtos para continuar.</p>
          <Link
            href="/"
            className="inline-block bg-[#F7B731] text-white font-bold py-3 px-8 rounded-xl"
          >
            Ver Produtos
          </Link>
        </div>
      </div>
    );
  }

  const stepTitles = ['', 'Identificação', 'Revisão', 'Pagamento'];
  
  const getFullAddress = () => {
    const numberStr = noNumber ? 'S/N' : number;
    return `${address}, ${numberStr}${complement ? ` - ${complement}` : ''}, ${neighborhood}, ${city}${state ? ` - ${state}` : ''}${cep ? `, CEP ${cep}` : ''}`;
  };
  


  return (
    <div className="w-full max-w-2xl mx-auto min-h-screen flex flex-col bg-white shadow-xl">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-gray-50 border-b border-gray-200 shadow-sm z-50">
        <div className="max-w-2xl mx-auto h-14 flex items-center justify-center px-4 relative">
          <button
            type="button"
            onClick={() => step > 1 ? setStep(step - 1) : router.back()}
            className="absolute left-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#F7B731]" />
          </button>
          <h1 className="text-sm font-bold tracking-wide text-gray-900">
            {stepTitles[step]}
          </h1>
          <div className="absolute right-4">
            {step === 2 ? (
              <button
                type="button"
                onClick={handleClearCart}
                className="text-[#F7B731] font-bold text-sm hover:text-yellow-600"
              >
                Limpar
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowCart(!showCart)}
                className="flex items-center gap-1"
              >
                <span className="text-sm font-bold text-[#F7B731]">
                  R$ {finalTotal.toFixed(2).replace('.', ',')}
                </span>
                <ChevronDown className={`w-4 h-4 text-[#F7B731] transition-transform ${showCart ? 'rotate-180' : ''}`} />
              </button>
            )}
          </div>
        </div>
        {/* Cart dropdown */}
        {showCart && step !== 2 && (
          <div className="max-w-2xl mx-auto bg-white border-t border-gray-200 p-4 space-y-2">
            {items.map(item => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-600">{item.quantity}x {item.name}</span>
                <span className="font-medium">R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
              </div>
            ))}
            <div className="border-t pt-2 flex justify-between text-sm">
              <span className="text-gray-600">Entrega</span>
              <span className="font-medium">{deliveryFee === 0 ? 'Grátis' : `R$ ${deliveryFee.toFixed(2).replace('.', ',')}`}</span>
            </div>
          </div>
        )}
      </header>

      {/* Main */}
      <main className="flex-1 pt-14 pb-20 overflow-y-auto">
        <form className="p-4 space-y-4" onSubmit={(e) => e.preventDefault()}>
          {/* Banner Modo Turbo - faixa com imagem */}
          {step === 1 && (
            <div className="-mx-4 -mt-4 mb-4">
              <div className="relative h-[70px] w-full overflow-hidden">
                <Image
                  src="/banner-modo-turbo.png"
                  alt="Modo Turbo"
                  fill
                  className="object-cover object-center"
                  priority
                />
              </div>
              <div className="bg-gradient-to-r from-yellow-400 via-[#F7B731] to-yellow-400 py-1.5 px-4 text-center">
                <p className="text-black text-xs font-bold tracking-wide">⚡ MODO TURBO - ENTREGA RÁPIDA ⚡</p>
              </div>
            </div>
          )}

          {/* Step 1: Identificação + Endereço */}
          {step === 1 && (
            <>
              {/* Dados pessoais */}
              <div className="bg-gray-50 rounded-2xl shadow-lg border border-gray-200 p-5 space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold mb-2 text-gray-900" htmlFor="name">
                    <User className="w-4 h-4 text-yellow-500" />
                    Nome Completo
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Digite seu nome completo"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F7B731] focus:border-[#F7B731] text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold mb-2 text-gray-900" htmlFor="phone">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 text-green-500" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Telefone/WhatsApp
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="(00) 00000-0000"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F7B731] focus:border-[#F7B731] text-sm"
                    required
                  />
                </div>
              </div>

              {/* Endereço - busca */}
              <div className="bg-gray-50 rounded-2xl shadow-lg border border-gray-200 p-5 space-y-3">
                <h2 className="font-bold text-sm text-gray-900">Escolha como deseja confirmar seu endereço</h2>
                
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#F7B731]" />
                  <input
                    type="text"
                    value={cep}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 8);
                      setCep(value);
                      if (value.length === 8) fetchAddressByCep(value);
                    }}
                    placeholder="Digite seu CEP"
                    maxLength={8}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F7B731] focus:border-[#F7B731] text-sm"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={gettingLocation}
                  className="w-full flex items-center gap-3 py-3 px-4 rounded-xl border-2 border-[#F7B731] bg-[#F7B731]/10 hover:bg-[#F7B731]/20 transition-colors disabled:opacity-50"
                >
                  {gettingLocation ? (
                    <Loader2 className="w-5 h-5 text-[#F7B731] animate-spin flex-shrink-0" />
                  ) : (
                    <Navigation className="w-5 h-5 text-[#F7B731] flex-shrink-0" />
                  )}
                  <div className="text-left flex-1">
                    <p className="font-semibold text-sm text-gray-900">
                      {gettingLocation ? 'Buscando localização...' : 'Usar Localização Atual'}
                    </p>
                    <p className="text-xs text-gray-500">Ativar permissão (recomendado)</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={handleManualAddress}
                  className="w-full flex items-center gap-3 py-2 px-4 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <p className="text-xs text-gray-400 text-left flex-1">Confirmar endereço manualmente</p>
                </button>
              </div>

              {/* Endereço completo - aparece quando preencher CEP, usar localização ou clicar em manual */}
              {showAddressForm && (
                <div ref={addressFormRef} className="bg-gray-50 rounded-2xl shadow-lg border border-gray-200 p-5 space-y-4">
                  <h2 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#F7B731]" />
                    Confirme seu endereço
                  </h2>
                  
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Rua / Avenida"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F7B731] focus:border-[#F7B731] text-sm"
                    required
                  />
                  
                  {/* Número e Complemento na mesma linha */}
                  <div className="grid grid-cols-5 gap-3">
                    <input
                      type="text"
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      placeholder="Número"
                      disabled={noNumber}
                      className="col-span-2 px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F7B731] focus:border-[#F7B731] text-sm disabled:opacity-50"
                    />
                    <input
                      type="text"
                      value={complement}
                      onChange={(e) => setComplement(e.target.value)}
                      placeholder="Complemento"
                      className="col-span-3 px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F7B731] focus:border-[#F7B731] text-sm"
                    />
                  </div>
                  
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={noNumber}
                      onChange={(e) => {
                        setNoNumber(e.target.checked);
                        if (e.target.checked) setNumber('');
                      }}
                      className="w-4 h-4 accent-[#F7B731]"
                    />
                    <span className="text-xs text-gray-500">Sem número</span>
                  </label>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      placeholder="Bairro"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F7B731] focus:border-[#F7B731] text-sm"
                      required
                    />
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Cidade"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F7B731] focus:border-[#F7B731] text-sm"
                    />
                  </div>
                </div>
              )}
            </>
          )}

          {/* Step 2: Revisão */}
          {step === 2 && (
            <div className="space-y-4 -mt-4">
              {/* Dados do cliente */}
              <div className="bg-gray-50 rounded-2xl shadow-lg border border-gray-200 p-4 space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-gray-900">Dados da Entrega</h3>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs text-[#F7B731] font-semibold hover:underline"
                  >
                    Editar
                  </button>
                </div>
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Nome</p>
                    <p className="text-gray-500 text-sm">{name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#F7B731] mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Telefone</p>
                    <p className="text-gray-500 text-sm">{phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Endereço</p>
                    <p className="text-gray-500 text-sm">{getFullAddress()}</p>
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <p className="flex items-center gap-2 text-[#F7B731] font-semibold text-sm">
                    <Clock className="w-5 h-5 text-yellow-500" />
                    Entrega em até 19 minutos
                  </p>
                </div>
              </div>

              {/* Itens do pedido */}
              <div className="bg-gray-50 rounded-2xl shadow-lg border border-gray-200 p-4">
                <h2 className="text-base font-bold mb-3 text-gray-900">Itens do Pedido</h2>
                <div className="space-y-3 mb-4 max-h-[200px] overflow-y-auto">
                  {items.map(item => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image
                          src={item.imageUrl || '/placeholder.png'}
                          alt={item.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-xs text-gray-900 truncate">
                          {item.quantity}x {item.name}
                        </p>
                        <p className="text-xs text-gray-500">Ofertas</p>
                        <p className="text-xs text-[#F7B731] mt-1">
                          R$ {item.price.toFixed(2).replace('.', ',')} cada
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900 text-sm">
                          R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Totais */}
                <div className="space-y-2 pt-3 border-t border-gray-200 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="text-gray-900">R$ {total.toFixed(2).replace('.', ',')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Taxa de entrega</span>
                    <span className="text-green-500 font-semibold">
                      {deliveryFee === 0 ? 'GRÁTIS' : `R$ ${deliveryFee.toFixed(2).replace('.', ',')}`}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="font-bold text-[#F7B731] text-xl">
                      R$ {finalTotal.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                  {savings > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-green-700 font-semibold text-sm">Você economizou</span>
                        <span className="font-bold text-green-600">
                          R$ {savings.toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Pagamento */}
          {step === 3 && (
            <>
              {/* Popup Banco Central - Cartão indisponível */}
              {showCardPopup && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4">
                  <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-300">
                    <div className="flex justify-end">
                      <button onClick={() => setShowCardPopup(false)} className="text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <h3 className="font-bold text-lg text-gray-900 mb-2">Instabilidade no Sistema</h3>
                      <p className="text-gray-600 text-sm mb-4">
                        O Banco Central está com instabilidade no momento. Aguarde a normalização ou finalize via <strong>PIX</strong>.
                      </p>
                      <p className="text-xs text-gray-400">Redirecionando para PIX em 5 segundos...</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tela de Gerando PIX */}
              {generatingPix && (
                <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-[100]">
                  <div className="animate-pulse">
                    <svg viewBox="0 0 48 48" className="w-24 h-24">
                      <path fill="#4db6ac" d="M11.9,12h-0.68l8.04-8.04c2.62-2.61,6.86-2.61,9.48,0L36.78,12H36.1c-1.6,0-3.11,0.62-4.24,1.76l-6.8,6.77c-0.59,0.59-1.53,0.59-2.12,0l-6.8-6.77C15.01,12.62,13.5,12,11.9,12z"/>
                      <path fill="#4db6ac" d="M36.1,36h0.68l-8.04,8.04c-2.62,2.61-6.86,2.61-9.48,0L11.22,36h0.68c1.6,0,3.11-0.62,4.24-1.76l6.8-6.77c0.59-0.59,1.53-0.59,2.12,0l6.8,6.77C32.99,35.38,34.5,36,36.1,36z"/>
                      <path fill="#4db6ac" d="M44.04,28.74L38.78,34H36.1c-1.07,0-2.07-0.42-2.83-1.17l-6.8-6.78c-1.36-1.36-3.58-1.36-4.94,0l-6.8,6.78C13.97,33.58,12.97,34,11.9,34H9.22l-5.26-5.26c-2.61-2.62-2.61-6.86,0-9.48L9.22,14h2.68c1.07,0,2.07,0.42,2.83,1.17l6.8,6.78c0.68,0.68,1.58,1.02,2.47,1.02s1.79-0.34,2.47-1.02l6.8-6.78C34.03,14.42,35.03,14,36.1,14h2.68l5.26,5.26C46.65,21.88,46.65,26.12,44.04,28.74z"/>
                    </svg>
                  </div>
                  <p className="text-lg font-bold text-gray-900 mt-6">Gerando PIX...</p>
                  <p className="text-sm text-gray-500 mt-2">Aguarde um momento</p>
                  <Loader2 className="w-6 h-6 text-teal-500 animate-spin mt-4" />
                </div>
              )}

              {/* Tela do QR Code PIX */}
              {pixData && !generatingPix && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 space-y-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg viewBox="0 0 48 48" className="w-10 h-10">
                        <path fill="#4db6ac" d="M11.9,12h-0.68l8.04-8.04c2.62-2.61,6.86-2.61,9.48,0L36.78,12H36.1c-1.6,0-3.11,0.62-4.24,1.76l-6.8,6.77c-0.59,0.59-1.53,0.59-2.12,0l-6.8-6.77C15.01,12.62,13.5,12,11.9,12z"/>
                        <path fill="#4db6ac" d="M36.1,36h0.68l-8.04,8.04c-2.62,2.61-6.86,2.61-9.48,0L11.22,36h0.68c1.6,0,3.11-0.62,4.24-1.76l6.8-6.77c0.59-0.59,1.53-0.59,2.12,0l6.8,6.77C32.99,35.38,34.5,36,36.1,36z"/>
                        <path fill="#4db6ac" d="M44.04,28.74L38.78,34H36.1c-1.07,0-2.07-0.42-2.83-1.17l-6.8-6.78c-1.36-1.36-3.58-1.36-4.94,0l-6.8,6.78C13.97,33.58,12.97,34,11.9,34H9.22l-5.26-5.26c-2.61-2.62-2.61-6.86,0-9.48L9.22,14h2.68c1.07,0,2.07,0.42,2.83,1.17l6.8,6.78c0.68,0.68,1.58,1.02,2.47,1.02s1.79-0.34,2.47-1.02l6.8-6.78C34.03,14.42,35.03,14,36.1,14h2.68l5.26,5.26C46.65,21.88,46.65,26.12,44.04,28.74z"/>
                      </svg>
                    </div>
                    <h2 className="font-bold text-xl text-gray-900">Pague com PIX</h2>
                    <p className="text-gray-500 text-sm mt-1">Escaneie o QR Code ou copie o código</p>
                  </div>

                  {/* QR Code */}
                  <div className="bg-gray-50 rounded-xl p-4 flex justify-center">
                    {pixData.copyPaste ? (
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(pixData.copyPaste)}`}
                        alt="QR Code PIX" 
                        className="w-48 h-48"
                      />
                    ) : (
                      <div className="w-48 h-48 bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                        QR Code não disponível
                      </div>
                    )}
                  </div>

                  {/* Valor */}
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Valor a pagar</p>
                    <p className="text-2xl font-bold text-teal-600">R$ {finalTotal.toFixed(2).replace('.', ',')}</p>
                  </div>

                  {/* Código copia e cola */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Código copia e cola:</p>
                    <div className="bg-gray-100 rounded-xl p-3 flex items-center gap-2">
                      <input 
                        type="text" 
                        readOnly 
                        value={pixData.copyPaste || ''} 
                        className="flex-1 bg-transparent text-xs text-gray-600 overflow-hidden"
                      />
                      <button
                        type="button"
                        onClick={copyToClipboard}
                        className="bg-teal-500 hover:bg-teal-600 text-white p-2 rounded-lg transition-colors flex-shrink-0"
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 text-center">
                    O PIX expira em 30 minutos. Após o pagamento, seu pedido será confirmado automaticamente.
                  </p>
                </div>
              )}

              {/* Seleção de pagamento - só mostra se não tiver pixData */}
              {!pixData && !generatingPix && (
                <>
                  {/* Banner Modo Turbo - faixa com imagem */}
                  <div className="-mx-4 -mt-4 mb-4">
                    <div className="relative h-[70px] w-full overflow-hidden">
                      <Image
                        src="/banner-modo-turbo.png"
                        alt="Modo Turbo"
                        fill
                        className="object-cover object-center"
                        priority
                      />
                    </div>
                    <div className="bg-gradient-to-r from-yellow-400 via-[#F7B731] to-yellow-400 py-1.5 px-4 text-center">
                      <p className="text-black text-xs font-bold tracking-wide">Entrega Rápida</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 space-y-4">
                    <h2 className="font-bold text-xl text-gray-900">Escolha a forma de pagamento</h2>
                  
                    {/* PIX */}
                    <div 
                      onClick={() => setPaymentMethod('PIX')}
                      className={`rounded-2xl border-2 p-4 cursor-pointer transition-all ${
                        paymentMethod === 'PIX' 
                          ? 'border-[#F7B731] bg-[#F7B731]/5' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center">
                          <svg viewBox="0 0 48 48" className="w-8 h-8">
                            <path fill="#4db6ac" d="M11.9,12h-0.68l8.04-8.04c2.62-2.61,6.86-2.61,9.48,0L36.78,12H36.1c-1.6,0-3.11,0.62-4.24,1.76l-6.8,6.77c-0.59,0.59-1.53,0.59-2.12,0l-6.8-6.77C15.01,12.62,13.5,12,11.9,12z"/>
                            <path fill="#4db6ac" d="M36.1,36h0.68l-8.04,8.04c-2.62,2.61-6.86,2.61-9.48,0L11.22,36h0.68c1.6,0,3.11-0.62,4.24-1.76l6.8-6.77c0.59-0.59,1.53-0.59,2.12,0l6.8,6.77C32.99,35.38,34.5,36,36.1,36z"/>
                            <path fill="#4db6ac" d="M44.04,28.74L38.78,34H36.1c-1.07,0-2.07-0.42-2.83-1.17l-6.8-6.78c-1.36-1.36-3.58-1.36-4.94,0l-6.8,6.78C13.97,33.58,12.97,34,11.9,34H9.22l-5.26-5.26c-2.61-2.62-2.61-6.86,0-9.48L9.22,14h2.68c1.07,0,2.07,0.42,2.83,1.17l6.8,6.78c0.68,0.68,1.58,1.02,2.47,1.02s1.79-0.34,2.47-1.02l6.8-6.78C34.03,14.42,35.03,14,36.1,14h2.68l5.26,5.26C46.65,21.88,46.65,26.12,44.04,28.74z"/>
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-gray-900">PIX</h3>
                        </div>
                        {paymentMethod === 'PIX' && (
                          <svg className="w-6 h-6 text-[#F7B731]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      
                      {paymentMethod === 'PIX' && (
                        <div className="mt-4">
                          <label className="text-xs font-medium text-gray-400 mb-1 block">CPF *</label>
                          <input
                            type="text"
                            value={cpf}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '');
                              if (value.length <= 11) {
                                const formatted = value
                                  .replace(/(\d{3})(\d)/, '$1.$2')
                                  .replace(/(\d{3})(\d)/, '$1.$2')
                                  .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
                                setCpf(formatted);
                              }
                            }}
                            placeholder="000.000.000-00"
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F7B731] focus:border-[#F7B731] text-sm"
                          />
                        </div>
                      )}
                    </div>

                    {/* Cartão de Crédito */}
                    <div 
                      onClick={() => setPaymentMethod('Cartão de Crédito')}
                      className={`rounded-2xl border-2 p-4 cursor-pointer transition-all ${
                        paymentMethod === 'Cartão de Crédito' 
                          ? 'border-[#F7B731] bg-[#F7B731]/5' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7 text-gray-500">
                            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                            <line x1="1" y1="10" x2="23" y2="10"/>
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-gray-900">Cartão de Crédito</h3>
                        </div>
                        {paymentMethod === 'Cartão de Crédito' && (
                          <svg className="w-6 h-6 text-[#F7B731]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      
                      {paymentMethod === 'Cartão de Crédito' && (
                        <div className="mt-4 space-y-4">
                          {/* Card Visual */}
                          <div className="relative w-full aspect-[1.6/1] rounded-2xl overflow-hidden bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 p-4 shadow-xl">
                            {/* Chip */}
                            <div className="absolute top-4 left-4 w-10 h-8 rounded bg-yellow-300/80 flex items-center justify-center">
                              <div className="w-6 h-5 rounded-sm bg-yellow-400 border border-yellow-500"></div>
                            </div>
                            {/* Card Icon */}
                            <div className="absolute top-4 right-4 w-10 h-8 border-2 border-white/60 rounded flex items-center justify-center">
                              <div className="w-4 h-4 border border-white/60 rounded-sm"></div>
                            </div>
                            {/* Card Number */}
                            <div className="absolute bottom-16 left-4 right-4">
                              <p className="text-white/90 text-lg font-mono tracking-widest">
                                {cardNumber || '0000 0000 0000 0000'}
                              </p>
                            </div>
                            {/* Card Info */}
                            <div className="absolute bottom-4 left-4 right-4 flex justify-between">
                              <div>
                                <p className="text-white/60 text-[10px] uppercase">Nome</p>
                                <p className="text-white text-xs font-semibold uppercase truncate max-w-[150px]">
                                  {cardName || 'NOME DO TITULAR'}
                                </p>
                              </div>
                              <div>
                                <p className="text-white/60 text-[10px] uppercase">Validade</p>
                                <p className="text-white text-xs font-semibold">
                                  {cardExpiry || 'MM/AA'}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Campos do Cartão */}
                          <div className="space-y-3">
                            <div>
                              <label className="text-xs font-medium text-gray-400 mb-1 block">Número do Cartão</label>
                              <div className="relative">
                                <input
                                  type="text"
                                  value={cardNumber}
                                  onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '');
                                    if (value.length <= 16) {
                                      const formatted = value.replace(/(\d{4})/g, '$1 ').trim();
                                      setCardNumber(formatted);
                                    }
                                  }}
                                  placeholder="0000 0000 0000 0000"
                                  className="w-full px-4 py-3 pr-10 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F7B731] focus:border-[#F7B731] text-sm"
                                />
                                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                                  <line x1="1" y1="10" x2="23" y2="10"/>
                                </svg>
                              </div>
                            </div>
                            
                            <div>
                              <label className="text-xs font-medium text-gray-400 mb-1 block">Nome do Titular</label>
                              <input
                                type="text"
                                value={cardName}
                                onChange={(e) => setCardName(e.target.value.toUpperCase())}
                                placeholder="NOME COMPLETO"
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F7B731] focus:border-[#F7B731] text-sm uppercase"
                              />
                            </div>
                            
                            <div className="flex gap-3">
                              <div className="flex-1">
                                <label className="text-xs font-medium text-gray-400 mb-1 block">Validade (MM/AA)</label>
                                <input
                                  type="text"
                                  value={cardExpiry}
                                  onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '');
                                    if (value.length <= 4) {
                                      const formatted = value.replace(/(\d{2})(\d)/, '$1/$2');
                                      setCardExpiry(formatted);
                                    }
                                  }}
                                  placeholder="MM/AA"
                                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F7B731] focus:border-[#F7B731] text-sm"
                                />
                              </div>
                              <div className="w-24">
                                <label className="text-xs font-medium text-gray-400 mb-1 block">CVV</label>
                                <input
                                  type="text"
                                  value={cardCvv}
                                  onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '');
                                    if (value.length <= 3) {
                                      setCardCvv(value);
                                    }
                                  }}
                                  placeholder="000"
                                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F7B731] focus:border-[#F7B731] text-sm"
                                />
                              </div>
                            </div>
                            
                            <button
                              type="button"
                              onClick={handleCardClick}
                              className="w-full bg-[#F7B731]/80 hover:bg-[#F7B731] text-white font-bold py-3 px-6 rounded-xl transition-colors text-sm mt-2"
                            >
                              Pagar com Cartão
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </form>
      </main>

      {/* Footer - esconder quando PIX já foi gerado */}
      {!pixData && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-50 border-t border-gray-200 shadow-lg z-50">
          <div className="max-w-2xl mx-auto flex items-center justify-center px-4 py-3">
            {step === 2 ? (
              <button
                type="button"
                onClick={handleContinue}
                className="w-full bg-[#F7B731] hover:bg-[#E5A623] text-white font-bold py-3 px-6 rounded-xl transition-colors text-base shadow-lg"
              >
                Continuar para Pagamento
              </button>
            ) : (
              <div className="w-full flex items-center justify-between gap-3">
                <div className="flex flex-col">
                  <p className="text-xs font-medium text-gray-400">Total do Pedido</p>
                  <p className="text-base font-bold text-[#F7B731]">
                    R$ {finalTotal.toFixed(2).replace('.', ',')} 
                    <span className="text-xs font-medium text-gray-400"> / {itemCount} {itemCount === 1 ? 'item' : 'itens'}</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (step === 3) {
                      if (paymentMethod === 'PIX') {
                        handleGeneratePix();
                      } else if (paymentMethod === 'Cartão de Crédito') {
                        handleCardClick();
                      }
                    } else {
                      handleContinue();
                    }
                  }}
                  disabled={
                    loading || 
                    generatingPix || 
                    (step === 3 && paymentMethod === 'PIX' && cpf.length < 14) ||
                    (step === 3 && paymentMethod === 'Cartão de Crédito' && (!cardNumber || !cardName || !cardExpiry || !cardCvv))
                  }
                  className="bg-[#F7B731] hover:bg-[#E5A623] text-white font-bold py-3 px-8 rounded-xl transition-colors text-sm shadow-lg disabled:opacity-50"
                >
                  {loading || generatingPix ? 'Processando...' : step === 3 ? 'Finalizar Pedido' : 'Continuar'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
