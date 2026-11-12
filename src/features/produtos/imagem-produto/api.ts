//src/features/produtos/imagem-produto/api.ts

import { httpClient } from '@/lib/http/client';
import {
    ImagemProdutoListResponse,
    ImagemProdutoConsultaResponse,
    ImagemProdutoCreateResponse,
    ImagemProdutoUpdateResponse,
    ImagemProdutoDeleteResponse,
} from './types';
import { ImagemProdutoCreateInput, ImagemProdutoUpdateInput, TIPO_VINCULO } from './schema';

function montarFormData(data: ImagemProdutoCreateInput): FormData {


    const formData = new FormData();

    if (data.tipo_vinculo === TIPO_VINCULO.PRODUTO) {
        formData.append('id_produto', String(data.id_produto));
        formData.append('id_produto_grade', '');
    } else {
        formData.append('id_produto_grade', String(data.id_produto_grade));
        formData.append('id_produto', '');
    }

    if (data.des_titulo_imagem) formData.append('des_titulo_imagem', data.des_titulo_imagem);
    if (data.des_imagem) formData.append('des_imagem', data.des_imagem);
    formData.append('num_ordem', String(data.num_ordem));
    formData.append('ind_principal', String(data.ind_principal ? 'true' : 'false'));
    if (data.arquivo) formData.append('foto', data.arquivo);

    return formData;
}

export const ImagensProduto = {

    listar: () => httpClient.get<ImagemProdutoListResponse>('/api/produtos/imagemProduto'),

    buscarPorProduto: (idProduto: number) => httpClient.get<ImagemProdutoConsultaResponse>(`/api/produtos/imagemProduto/${idProduto}`),

    buscarPorGrade: (idGrade: number) => httpClient.get<ImagemProdutoConsultaResponse>(`/api/produtos/imagemProdutoGrade/${idGrade}`),

    criar: (data: ImagemProdutoCreateInput) => httpClient.upload<ImagemProdutoCreateResponse>('/api/produtos/imagemProduto', montarFormData(data)),

    atualizar: (id: number, data: ImagemProdutoUpdateInput) => httpClient.put<ImagemProdutoUpdateResponse>(`/api/produtos/imagemProduto/${id}`, montarFormData(data)),

    deletar: (id: number) => httpClient.delete<ImagemProdutoDeleteResponse>(`/api/produtos/imagemProduto/${id}`),
};
