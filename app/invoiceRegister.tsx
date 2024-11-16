import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  firstName: string;
  profilePic: string;
}

interface InvoiceData {
  invoiceNumber: number;
  date: string;
  partyName: string;
  qty: number;
  area: string;
  amount: string;
  id: string;
}

const InvoiceRegister: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [data, setData] = useState<InvoiceData[]>([]);
  const [filteredData, setFilteredData] = useState<InvoiceData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // Filters state
  const [filters, setFilters] = useState({
    invoiceNumber: '',
    partyName: '',
    startDate: '',
    endDate: '',
  });

  // Fetch user data from AsyncStorage
  useEffect(() => {
    const loadUserData = async () => {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    };
    loadUserData();
  }, []);

  // Fetch Invoice Register data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://6736c416aafa2ef2223171a1.mockapi.io/esyapi/invoiceRegister');
        const result = await response.json();
        setData(result);
        setFilteredData(result); // Initialize filteredData with full dataset
      } catch (error) {
        console.error('Error fetching Invoice Register data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Apply filters
  useEffect(() => {
    const filtered = data.filter((item) => {
      const matchesInvoiceNumber = filters.invoiceNumber
        ? item.invoiceNumber.toString().includes(filters.invoiceNumber)
        : true;
      const matchesPartyName = filters.partyName
        ? item.partyName.toLowerCase().includes(filters.partyName.toLowerCase())
        : true;

      const invoiceDate = new Date(item.date);
      const matchesStartDate = filters.startDate
        ? invoiceDate >= new Date(filters.startDate)
        : true;
      const matchesEndDate = filters.endDate
        ? invoiceDate <= new Date(filters.endDate)
        : true;

      return matchesInvoiceNumber && matchesPartyName && matchesStartDate && matchesEndDate;
    });
    setFilteredData(filtered);
    setCurrentPage(1); // Reset to first page on filter change
  }, [filters, data]);

  // Paginated data
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Render each row of the table
  const renderItem = ({ item }: { item: InvoiceData }) => (
    <View style={styles.tableRow}>
      <Text style={[styles.tableCell, styles.columnInvoiceNumber]}>{item.invoiceNumber}</Text>
      <Text style={[styles.tableCell, styles.columnDate]}>{new Date(item.date).toLocaleDateString()}</Text>
      <Text style={[styles.tableCell, styles.columnParty]}>{item.partyName}</Text>
      <Text style={[styles.tableCell, styles.columnQty]}>{item.qty}</Text>
      <Text style={[styles.tableCell, styles.columnArea]}>{item.area}</Text>
      <Text style={[styles.tableCell, styles.columnAmount]}>₹ {item.amount}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Top card with user information */}
      <LinearGradient
        colors={['#6a11cb', '#2575fc']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {user && <Text style={styles.userName}>Hello, {user.firstName}!</Text>}
        <Text style={styles.title}>Invoice Register</Text>
      </LinearGradient>

      {/* Filters */}
      <View style={styles.filterContainer}>
        <TextInput
          style={styles.filterInput}
          placeholder="Filter by Invoice Number"
          value={filters.invoiceNumber}
          onChangeText={(text) => setFilters((prev) => ({ ...prev, invoiceNumber: text }))}
        />
        <TextInput
          style={styles.filterInput}
          placeholder="Filter by Party Name"
          value={filters.partyName}
          onChangeText={(text) => setFilters((prev) => ({ ...prev, partyName: text }))}
        />
      </View>
      <View style={styles.filterContainer}>
        <TextInput
          style={styles.filterInput}
          placeholder="Start Date (YYYY-MM-DD)"
          value={filters.startDate}
          onChangeText={(text) => setFilters((prev) => ({ ...prev, startDate: text }))}
        />
        <TextInput
          style={styles.filterInput}
          placeholder="End Date (YYYY-MM-DD)"
          value={filters.endDate}
          onChangeText={(text) => setFilters((prev) => ({ ...prev, endDate: text }))}
        />
      </View>

      {/* Table */}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <ScrollView horizontal>
          <View style={styles.tableContainer}>
            {/* Table header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, styles.columnInvoiceNumber]}>Invoice Number</Text>
              <Text style={[styles.tableHeaderText, styles.columnDate]}>Date</Text>
              <Text style={[styles.tableHeaderText, styles.columnParty]}>Party Name</Text>
              <Text style={[styles.tableHeaderText, styles.columnQty]}>Qty</Text>
              <Text style={[styles.tableHeaderText, styles.columnArea]}>Area</Text>
              <Text style={[styles.tableHeaderText, styles.columnAmount]}>Amount</Text>
            </View>

            {/* Table body */}
            <FlatList
              data={paginatedData}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
            />
          </View>
        </ScrollView>
      )}

      {/* Pagination */}
      <View style={styles.paginationContainer}>
        <TouchableOpacity
          disabled={currentPage === 1}
          onPress={() => setCurrentPage((prev) => prev - 1)}
          style={[styles.paginationButton, currentPage === 1 && styles.disabledButton]}
        >
          <Text style={styles.paginationText}>Previous</Text>
        </TouchableOpacity>
        <Text style={styles.paginationText}>
          Page {currentPage} of {Math.ceil(filteredData.length / rowsPerPage)}
        </Text>
        <TouchableOpacity
          disabled={currentPage === Math.ceil(filteredData.length / rowsPerPage)}
          onPress={() => setCurrentPage((prev) => prev + 1)}
          style={[styles.paginationButton, currentPage === Math.ceil(filteredData.length / rowsPerPage) && styles.disabledButton]}
        >
          <Text style={styles.paginationText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    width: '100%',
    paddingVertical: 40,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  userName: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  filterInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginHorizontal: 5,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    margin: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
  },
  tableHeaderText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tableCell: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  columnInvoiceNumber: {
    width: 100,
  },
  columnDate: {
    width: 100,
  },
  columnParty: {
    width: 150,
  },
  columnQty: {
    width: 80,
  },
  columnArea: {
    width: 100,
  },
  columnAmount: {
    width: 100,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 10,
    marginBottom: 10,
  },
  paginationButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  disabledButton: {
    backgroundColor: '#ddd',
  },
  paginationText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
});

export default InvoiceRegister;
