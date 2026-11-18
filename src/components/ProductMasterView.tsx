import React, { useState } from 'react';
import { ProductModel, ProductStatus } from '../types';
import { Plus, Search, Filter, Cpu, CheckCircle2, AlertCircle } from 'lucide-react';

interface ProductMasterViewProps {
  products: ProductModel[];
  onAddProduct: (product: ProductModel) => void;
  onUpdateProduct: (product: ProductModel) => void;
}

export const ProductMasterView: React.FC<ProductMasterViewProps> = ({
  products,
  onAddProduct,
  onUpdateProduct,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductModel | null>(products[0] || null);

  // New product form state
  const [newModel, setNewModel] = useState<Partial<ProductModel>>({
    modelNumber: '',
    name: '',
    partNumber: '',
    revision: 'Rev A.1',
    customer: '',
    vehicleModel: '',
    harnessType: 'Engine Compartment Main',
    housingReferences: '',
    circuitCount: 40,
    processName: 'Connector Insertion, Taping & Continuity Testing',
    assemblyLine: 'Line 4 (Alpha)',
    productionMethod: 'Progressive Conveyor Board',
    qualityCheckpoints: 'Push-Pull-Push Terminal Lock, Dual-Stage Hinge Snap, 100% Continuity',
    effectiveDate: new Date().toISOString().split('T')[0],
    status: 'Active',
    currentWorkStudyRev: 'WSR-2026-01',
  });

  const [formError, setFormError] = useState('');

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.modelNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.partNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModel.modelNumber || !newModel.name || !newModel.partNumber) {
      setFormError('Please fill in all mandatory product fields.');
      return;
    }

    // Check duplicate model + revision
    const exists = products.some(
      (p) =>
        p.modelNumber.toLowerCase() === newModel.modelNumber?.toLowerCase() &&
        p.revision.toLowerCase() === newModel.revision?.toLowerCase()
    );
    if (exists) {
      setFormError(`Product ${newModel.modelNumber} with ${newModel.revision} already exists! Controlled revision required.`);
      return;
    }

    const created: ProductModel = {
      id: `prod-${Date.now()}`,
      modelNumber: newModel.modelNumber!,
      name: newModel.name!,
      partNumber: newModel.partNumber!,
      revision: newModel.revision || 'Rev A.1',
      customer: newModel.customer || 'Global OEM',
      vehicleModel: newModel.vehicleModel || 'Standard Vehicle',
      harnessType: newModel.harnessType || 'Wiring Harness',
      housingReferences: newModel.housingReferences || 'Standard Connectors',
      circuitCount: Number(newModel.circuitCount) || 30,
      processName: newModel.processName || 'Standard Assembly',
      assemblyLine: newModel.assemblyLine || 'Assembly Line',
      productionMethod: newModel.productionMethod || 'Conveyor Jig',
      qualityCheckpoints: newModel.qualityCheckpoints || 'Visual & Continuity',
      effectiveDate: newModel.effectiveDate || new Date().toISOString().split('T')[0],
      status: (newModel.status as ProductStatus) || 'Active',
      currentWorkStudyRev: newModel.currentWorkStudyRev || 'WSR-NEW',
    };

    onAddProduct(created);
    setSelectedProduct(created);
    setIsModalOpen(false);
    setFormError('');
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Product &amp; Process Master Data</h2>
          <p className="text-xs text-slate-500">
            Controlled engineering configurations for automotive wiring harness models, circuit counts, and connector housings.
          </p>
        </div>
        <button
          onClick={() => {
            setFormError('');
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Register Product Model</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-3 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2 flex-grow max-w-md">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Model (WH-ENG-8402), Part #, Customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-500 font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-700 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Draft">Draft</option>
            <option value="On Hold">On Hold</option>
            <option value="Obsolete">Obsolete</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Master List on Left, Detail Card on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product List */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
          <div className="p-3 bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-700">
            Registered Models ({filteredProducts.length})
          </div>
          <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
            {filteredProducts.map((p) => {
              const isSelected = selectedProduct?.id === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedProduct(p)}
                  className={`w-full text-left p-3.5 transition-colors ${
                    isSelected ? 'bg-blue-50/70 border-l-2 border-blue-600' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-slate-900 font-mono">{p.modelNumber}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-mono bg-slate-100 text-slate-600">
                      {p.revision}
                    </span>
                  </div>
                  <div className="text-xs font-medium text-slate-800 truncate mb-1">{p.name}</div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>{p.customer}</span>
                    <span className="font-mono">{p.circuitCount} circuits</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Details Card */}
        <div className="lg:col-span-2">
          {selectedProduct ? (
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-slate-900 font-mono">{selectedProduct.modelNumber}</span>
                    <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-mono font-medium">
                      {selectedProduct.revision}
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-medium">
                      {selectedProduct.status}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-700 mt-1">{selectedProduct.name}</h3>
                </div>
                <div className="text-left sm:text-right text-xs text-slate-500">
                  <div>Part Number: <strong className="font-mono text-slate-800">{selectedProduct.partNumber}</strong></div>
                  <div>Effective Date: <span className="font-mono">{selectedProduct.effectiveDate}</span></div>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded border border-slate-100 space-y-1">
                  <span className="text-slate-400 text-[11px] block">Customer &amp; Vehicle Platform</span>
                  <div className="font-semibold text-slate-900">{selectedProduct.customer}</div>
                  <div className="text-slate-600">{selectedProduct.vehicleModel}</div>
                </div>

                <div className="p-3 bg-slate-50 rounded border border-slate-100 space-y-1">
                  <span className="text-slate-400 text-[11px] block">Harness Architecture &amp; Circuits</span>
                  <div className="font-semibold text-slate-900">{selectedProduct.harnessType}</div>
                  <div className="text-slate-600 font-mono font-medium">{selectedProduct.circuitCount} Total Circuits</div>
                </div>

                <div className="p-3 bg-slate-50 rounded border border-slate-100 space-y-1">
                  <span className="text-slate-400 text-[11px] block">Assembly Line &amp; Method</span>
                  <div className="font-semibold text-slate-900">{selectedProduct.assemblyLine}</div>
                  <div className="text-slate-600">{selectedProduct.productionMethod}</div>
                </div>

                <div className="p-3 bg-slate-50 rounded border border-slate-100 space-y-1">
                  <span className="text-slate-400 text-[11px] block">Work Study Reference</span>
                  <div className="font-semibold text-slate-900 font-mono">{selectedProduct.currentWorkStudyRev}</div>
                  <div className="text-slate-600">Controlled Industrial Engineering Standard</div>
                </div>
              </div>

              {/* Housing & Connector Specs */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Housing &amp; Connector References
                </h4>
                <div className="p-3 bg-slate-50 rounded border border-slate-100 text-xs text-slate-700 leading-relaxed font-mono">
                  {selectedProduct.housingReferences}
                </div>
              </div>

              {/* Quality Checkpoints */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Mandatory Quality Checkpoints
                </h4>
                <div className="p-3 bg-emerald-50/60 rounded border border-emerald-100 text-xs text-emerald-900 leading-relaxed flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{selectedProduct.qualityCheckpoints}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-lg p-12 text-center text-slate-400">
              Select a product model to view detailed engineering parameters.
            </div>
          )}
        </div>
      </div>

      {/* Registration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900">Register New Harness Model / Revision</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                &times;
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-rose-50 text-rose-700 rounded text-xs flex items-center gap-2 border border-rose-200">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Model Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. WH-ENG-9100"
                    value={newModel.modelNumber}
                    onChange={(e) => setNewModel({ ...newModel, modelNumber: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Revision *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rev A.1"
                    value={newModel.revision}
                    onChange={(e) => setNewModel({ ...newModel, revision: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Instrument Panel Main Harness"
                    value={newModel.name}
                    onChange={(e) => setNewModel({ ...newModel, name: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">OEM Part Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 82111-50B30"
                    value={newModel.partNumber}
                    onChange={(e) => setNewModel({ ...newModel, partNumber: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Customer</label>
                  <input
                    type="text"
                    placeholder="e.g. Toyota Global"
                    value={newModel.customer}
                    onChange={(e) => setNewModel({ ...newModel, customer: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Vehicle Model</label>
                  <input
                    type="text"
                    placeholder="e.g. RAV4 HEV 2026"
                    value={newModel.vehicleModel}
                    onChange={(e) => setNewModel({ ...newModel, vehicleModel: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Circuit Count</label>
                  <input
                    type="number"
                    min="1"
                    value={newModel.circuitCount}
                    onChange={(e) => setNewModel({ ...newModel, circuitCount: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Housing &amp; Connector Specifications</label>
                <textarea
                  rows={2}
                  placeholder="e.g. 48-Way Sealed ECU Housing, 24-Way Fuse Box, 12x 2-Way Sensor Housings"
                  value={newModel.housingReferences}
                  onChange={(e) => setNewModel({ ...newModel, housingReferences: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Mandatory Quality Checkpoints</label>
                <input
                  type="text"
                  placeholder="e.g. Push-Pull-Push Terminal Lock, High-Pot Continuity Check"
                  value={newModel.qualityCheckpoints}
                  onChange={(e) => setNewModel({ ...newModel, qualityCheckpoints: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700"
                >
                  Save Master Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
