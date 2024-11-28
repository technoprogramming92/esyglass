import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { DataTable, Button, Card, Title } from "react-native-paper";

interface PIRegisterData {
  invoiceNumber: number;
  date: string;
  partyName: string;
  qty: number;
  area: string;
  amount: string;
  id: string;
}

const PIRegister: React.FC = () => {
  const [data, setData] = useState<PIRegisterData[]>([]);
  const [filteredData, setFilteredData] = useState<PIRegisterData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // Filters state
  const [filters, setFilters] = useState({
    invoiceNumber: "",
    partyName: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://6736c416aafa2ef2223171a1.mockapi.io/esyapi/invoiceRegister"
        );
        const result = await response.json();
        setData(result);
        setFilteredData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
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

      return (
        matchesInvoiceNumber &&
        matchesPartyName &&
        matchesStartDate &&
        matchesEndDate
      );
    });
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [filters, data]);

  // Paginated data
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Title style={styles.title}>PI Register</Title>
      </Card>

      {/* Filters */}
      <View style={styles.filterContainer}>
        <TextInput
          style={styles.filterInput}
          placeholder="Filter by Invoice Number"
          value={filters.invoiceNumber}
          onChangeText={(text) =>
            setFilters((prev) => ({ ...prev, invoiceNumber: text }))
          }
        />
        <TextInput
          style={styles.filterInput}
          placeholder="Filter by Party Name"
          value={filters.partyName}
          onChangeText={(text) =>
            setFilters((prev) => ({ ...prev, partyName: text }))
          }
        />
      </View>
      <View style={styles.filterContainer}>
        <TextInput
          style={styles.filterInput}
          placeholder="Start Date (YYYY-MM-DD)"
          value={filters.startDate}
          onChangeText={(text) =>
            setFilters((prev) => ({ ...prev, startDate: text }))
          }
        />
        <TextInput
          style={styles.filterInput}
          placeholder="End Date (YYYY-MM-DD)"
          value={filters.endDate}
          onChangeText={(text) =>
            setFilters((prev) => ({ ...prev, endDate: text }))
          }
        />
      </View>

      {/* Table */}
      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" />
      ) : (
        <ScrollView horizontal>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Invoice Number</DataTable.Title>
              <DataTable.Title>Date</DataTable.Title>
              <DataTable.Title>Party Name</DataTable.Title>
              <DataTable.Title numeric>Qty</DataTable.Title>
              <DataTable.Title numeric>Area</DataTable.Title>
              <DataTable.Title numeric>Amount</DataTable.Title>
            </DataTable.Header>

            {paginatedData.map((item) => (
              <DataTable.Row key={item.id}>
                <DataTable.Cell>{item.invoiceNumber}</DataTable.Cell>
                <DataTable.Cell>
                  {new Date(item.date).toLocaleDateString()}
                </DataTable.Cell>
                <DataTable.Cell>{item.partyName}</DataTable.Cell>
                <DataTable.Cell numeric>{item.qty}</DataTable.Cell>
                <DataTable.Cell numeric>{item.area}</DataTable.Cell>
                <DataTable.Cell numeric>₹ {item.amount}</DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
        </ScrollView>
      )}

      {/* Pagination */}
      <View style={styles.paginationContainer}>
        <Button
          mode="contained"
          disabled={currentPage === 1}
          onPress={() => setCurrentPage((prev) => prev - 1)}
        >
          Previous
        </Button>
        <Text style={styles.paginationText}>
          Page {currentPage} of {Math.ceil(filteredData.length / rowsPerPage)}
        </Text>
        <Button
          mode="contained"
          disabled={
            currentPage === Math.ceil(filteredData.length / rowsPerPage)
          }
          onPress={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    padding: 10,
  },
  card: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4CAF50",
    textAlign: "center",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  filterInput: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginHorizontal: 5,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20,
  },
  paginationText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default PIRegister;
