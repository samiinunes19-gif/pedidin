'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { RefreshCw, CheckCircle, Clock, Trash2, XCircle, Search, FileText, ToggleLeft, ToggleRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState({ whitePageActive: false });
  const [searchTerm, setSearchTerm] = useState('');

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders?password=${password}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
        setAuthenticated(true);
        fetchConfig();
        toast.success('Login efetuado com sucesso');
      } else {
        toast.error('Senha incorreta');
      }
    } catch (err) {
      toast.error('Erro ao conectar');
    }
    setLoading(false);
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch(`/api/admin/orders?password=${password}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/admin/config');
      if (res.ok) {
        const data = await res.json();
        setConfig(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleWhitePage = async () => {
    try {
      const res = await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, whitePageActive: !config.whitePageActive })
      });
      if (res.ok) {
        const data = await res.json();
        setConfig(data.config);
        toast.success(`White Page ${data.config.whitePageActive ? 'Ativada' : 'Desativada'}`);
      } else {
        toast.error('Erro ao atualizar configuração');
      }
    } catch (err) {
      toast.error('Erro de conexão');
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, orderId, status })
      });
      if (res.ok) {
        toast.success('Status atualizado');
        fetchOrders();
      } else {
        toast.error('Erro ao atualizar status');
      }
    } catch (err) {
      toast.error('Erro de conexão');
    }
  };

  const deleteOrder = async (orderId: string) => {
    if (!confirm('Tem certeza que deseja apagar este pedido?')) return;
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, orderId })
      });
      if (res.ok) {
        toast.success('Pedido apagado');
        fetchOrders();
      } else {
        toast.error('Erro ao apagar pedido');
      }
    } catch (err) {
      toast.error('Erro de conexão');
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
            <p className="text-gray-500 text-sm mt-2">Acesse o painel de controle</p>
          </div>
          <form onSubmit={login} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Senha de acesso"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#F7B731] focus:ring-0"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#F7B731] hover:bg-[#e5a623] text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
            >
              {loading ? 'Acessando...' : 'Entrar'}
            </button>
            <div className="text-center mt-4">
              <Link href="/" className="text-sm text-gray-500 hover:text-[#F7B731]">
                Voltar para o site
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.customerPhone?.includes(searchTerm)
  );

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    revenue: orders.filter(o => o.status === 'paid').reduce((acc, curr) => acc + curr.total, 0)
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar Admin */}
      <nav className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold font-oswald text-[#F7B731]">PAINEL ADMIN</h1>
              <Link href="/" className="text-sm text-gray-400 hover:text-white flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" /> Ver Loja
              </Link>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 bg-gray-800 px-4 py-2 rounded-lg">
                <span className="text-sm font-medium">Modo White Page:</span>
                <button 
                  onClick={toggleWhitePage}
                  className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm font-bold transition-colors ${config.whitePageActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}
                >
                  {config.whitePageActive ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                  {config.whitePageActive ? 'ATIVADO' : 'DESATIVADO'}
                </button>
              </div>
              
              <button onClick={fetchOrders} className="p-2 hover:bg-gray-800 rounded-full transition-colors" title="Atualizar Pedidos">
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 border-l-4 border-l-blue-500">
            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total de Pedidos</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 border-l-4 border-l-yellow-500">
            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Aguardando Pagamento</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 border-l-4 border-l-green-500">
            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Receita (Pagos)</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">
              R$ {stats.revenue.toFixed(2).replace('.', ',')}
            </p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Gerenciamento de Pedidos</h2>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por ID, Nome ou Tel..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 focus:border-[#F7B731] focus:ring-1 focus:ring-[#F7B731] text-sm"
            />
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {filteredOrders.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Nenhum pedido encontrado.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-600">
                  <tr>
                    <th className="px-6 py-4 font-semibold">ID / Data</th>
                    <th className="px-6 py-4 font-semibold">Cliente</th>
                    <th className="px-6 py-4 font-semibold">Pagamento</th>
                    <th className="px-6 py-4 font-semibold">Total</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-mono text-xs text-gray-500 mb-1">{order.id.split('_')[2]}</div>
                        <div className="text-gray-900">{new Date(order.createdAt).toLocaleString('pt-BR')}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{order.customerName}</div>
                        <div className="text-gray-500 text-xs mt-1">{order.customerPhone}</div>
                        <div className="text-gray-400 text-xs mt-1 truncate max-w-[200px]" title={order.address}>{order.address}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.paymentMethod === 'PIX' ? 'bg-teal-100 text-teal-800' :
                          order.paymentMethod === 'Cartão de Crédito' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.paymentMethod}
                        </span>
                        {order.changeFor && (
                          <div className="text-xs text-gray-500 mt-1">Troco p/ R$ {order.changeFor}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">R$ {order.total.toFixed(2).replace('.', ',')}</div>
                        <div className="text-xs text-gray-500 mt-1">{order.items?.length || 0} itens</div>
                      </td>
                      <td className="px-6 py-4">
                        {order.status === 'pending' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                            <Clock className="w-3.5 h-3.5" /> Aguardando
                          </span>
                        )}
                        {order.status === 'paid' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                            <CheckCircle className="w-3.5 h-3.5" /> Pago
                          </span>
                        )}
                        {order.status === 'cancelled' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                            <XCircle className="w-3.5 h-3.5" /> Cancelado
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {order.status === 'pending' && (
                            <>
                              <button
                                onClick={() => updateOrderStatus(order.id, 'paid')}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Marcar como Pago"
                              >
                                <CheckCircle className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => updateOrderStatus(order.id, 'cancelled')}
                                className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Cancelar Pedido"
                              >
                                <XCircle className="w-5 h-5" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => deleteOrder(order.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Apagar Pedido"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
