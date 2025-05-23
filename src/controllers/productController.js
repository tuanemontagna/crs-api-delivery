import fs from "fs";
import Product from '../models/ProductModel.js';
import uploadFile from '../utils/uploadFile.js';

const get = async (req, res) => {
  try {
    const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null;

    if (!id) {
      const response = await Product.findAll({
        order: [['id', 'desc']],
      });
      
      return res.status(200).send({
        message: 'Dados encontrados',
        data: response,
      });
    }

    const response = await Product.findOne({
      where: {
        id: id
      }
    });

    if (!response) {
      return res.status(404).send('nao achou')
    }

    return res.status(200).send({
      message: 'Dados encontrados',
      data: response,
    })
  } catch (error) {
    return res.status(500).send({
      message: error.message
    });
  }
}

const create = async (corpo, req, res) => {
  try {
    
    const {
      name,
      price,
      description,
      idCategories
    } = corpo

    const createdProduct = await Product.create({
      name,
      price,
      description,
      idCategories
    });
    
    const imageProduct = req.files?.imageProduct;
        
    if(imageProduct) {
        const upload = await uploadFile(
            imageProduct,
            { id: createdProduct.id, tipo: 'image', tabela: 'product' },
            res
        );
        console.log(upload.type);
        
        if (upload.type === 'error') {
            await createdProduct.destroy(); 
            return res.send({ 
                message: upload.message
            });
        }

        const image = upload.message.replace('public/', '');
        createdProduct.image = image;
    }

    await createdProduct.save();
    return createdProduct;

  } catch (error) {
    throw new Error(error.message)
  }
}

const update = async (corpo, id, req) => {
  try {
    const response = await Product.findOne({ where: { id } });

    if (req.files && req.files.imageProduct) {
      const imageProduct = req.files.imageProduct;
      const upload = await uploadFile(imageProduct, { id: Date.now(), tipo: 'image', tabela: 'product' });

      if (upload.type === 'erro') {
          throw new Error(upload.message);
      }

      if (response.image) {
          fs.unlinkSync(`./public/${response.image}`);
      }

      response.image = upload.message.replace('public/', '');
    }
        
    Object.keys(corpo).forEach((item) => {
        if (item !== 'image') {
            response[item] = corpo[item];
        }
    });

    await response.save();
    return response;

  } catch (error) {
    throw new Error(error.message)
  }
}

const persist = async (req, res) => {
  try {
    const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null;
    
    if (!id) {
      const response = await create(req.body, req, res);
      return res.status(201).send({
        message: 'criado com sucesso!',
        data: response
      });
    }

    const response = await update(req.body, id);
    return res.status(201).send({
      message: 'atualizado com sucesso!',
      data: response
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message
    });
  }
}

const destroy = async (req, res) => {
  try {
    const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null;
    if (!id) {
      return res.status(400).send('informa ai paezao')
    }

    const response = await Product.findOne({
      where: {
        id
      }
    });

    if (!response) {
      return res.status(404).send('nao achou');
    }

    await response.destroy();

    return res.status(200).send({
      message: 'registro excluido',
      data: response
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message
    });
  }
}

const getByCategory = async (req, res) => {
  try {
    const idCategory = req.params.idCategory ? req.params.idCategory.toString().replace(/\D/g, '') : null;

    if (!idCategory) {
      return res.status(400).send({
        message: 'Informe o id da categoria'
      });
    }

    const response = await Product.findAll({
      where: { idCategories: idCategory },
      order: [['id', 'desc']],
    });

    if (!response || response.length === 0) {
      return res.status(404).send({
        message: 'Nenhum produto encontrado para esta categoria'
      });
    }

    if (!response) {
      return res.status(404).send({
        message: 'Nenhum produto encontrado para esta categoria'
      });
    }

    return res.status(200).send({
      message: 'Produtos encontrados',
      data: response,
    });
  } catch (error) {
     return res.status(500).send({
      message: error.message
    });
  }
}


export default {
  get,
  persist,
  destroy,
  getByCategory,
}