import { useState } from 'react';
import { ActivityIndicator } from 'react-native';

import { Button } from '../components/Button';
import { Cart } from '../components/Cart';
import { Categories } from '../components/Categories';
import { Header } from '../components/Header';
import { Menu } from '../components/Menu';
import { TableModal } from '../components/TableModal';
import { CartItem } from '../types/CartItem';
import {
  Container,
  CategoriesContainer,
  MenuContainer,
  Footer,
  FooterContainer,
  CenteredContainer,
} from './styles';

import { Empty } from '../components/Icons/Empty';

import { Product } from '../types/Product';
import {products as mockProducts} from '../mocks/products';
import { Text } from '../components/Text';

export function Main() {
  const [isLoading, setIsLoading] = useState(false);
  const [isTableModalVisible, setIsTableModalVisible] = useState(false);
  const [selectedTable, setSelectedTable] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>(mockProducts);


  function handleSaveTable(table: string) {
    setSelectedTable(table);
  }

  function handleResetOrder(){
    setSelectedTable('');
    setCartItems([]);
  }

  function handleAddToCart(product: Product) {
    if(!selectedTable) {
      setIsTableModalVisible(true);
    }

    setCartItems((prevState) => {
      const itemIndex = prevState.findIndex(
        cartItem => cartItem.product._id === product._id
      );

      if(itemIndex < 0) {
        return prevState.concat({
          quantity: 1,
          product,
        });
      }

      const newCartItems = [...prevState];
      const item = newCartItems[itemIndex];

      newCartItems[itemIndex] = {
        ...item,
        quantity: item.quantity + 1,
      };

      return newCartItems;
    });
  }

  function handleDecrementCartItem(product: Product) {
    setCartItems((prevState) => {
      const itemIndex = prevState.findIndex(
        cartItem => cartItem.product._id === product._id
      );
      const item = prevState[itemIndex];
      const newCartItems = [...prevState];

      if(item.quantity === 1) {
        newCartItems.splice(itemIndex, 1);

        return newCartItems;
      }

      newCartItems[itemIndex] = {
        ...item,
        quantity: item.quantity - 1,
      };

      return newCartItems;
    });
  }

  return (
    <>
      <Container>
        <Header
          selectedTable={selectedTable}
          onCancelOrder={handleResetOrder}
        />

        {isLoading ? (
          <CenteredContainer>
            <ActivityIndicator color='#d73035' size='large'/>
          </CenteredContainer>
        ) : (
          <>
            <CategoriesContainer>
              <Categories/>
            </CategoriesContainer>

            {products.length > 0 ? (
              <MenuContainer>
                <Menu
                  products={products}
                  onAddToCart={handleAddToCart}
                />
              </MenuContainer>
            ) : (
              <CenteredContainer>
                <Empty/>
                <Text color='#666' style={{ marginTop: 24 }}>Nenhum produto foi encontrado!</Text>
              </CenteredContainer>
            )}
          </>
        )}

      </Container>

      <Footer>
        <FooterContainer>
          {!selectedTable && (
            <Button onPress={()=> setIsTableModalVisible(true)} disabled={isLoading}>
              Novo Pedido
            </Button>
          )}

          {selectedTable && (
            <Cart
              cartItems={cartItems}
              onAdd={handleAddToCart}
              onDecrement={handleDecrementCartItem}
              onConfirmOrder={handleResetOrder}
            />
          )}
        </FooterContainer>
      </Footer>

      <TableModal
        visible={isTableModalVisible}
        onClose={()=> setIsTableModalVisible(false)}
        onSave={handleSaveTable}
      />
    </>
  );
}
