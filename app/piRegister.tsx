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
import { LinearGradient } from "expo-linear-gradient";

interface PIRegisterData {
  GrpFld1: string; // Party Name
  GrpFld2: string; // PI Number
  OdrTotQty: number; // Total Quantity
  OdrTotArea: number; // Total Area
  OdrBsAmt: number; // Basic Amount
  OdrNetAmt: number; // Net Amount
}

const rowsPerPage = 10; // Number of rows per page

const PIRegister: React.FC = () => {
  const [data, setData] = useState<PIRegisterData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState({
    partyName: "",
    piNumber: "",
  });

  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "http://api4.rectrans.in/api/EstOrder/GetEstOdrByRefNo",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              GrpFlag: "AC",
              OdrNoFrom: 100,
              OdrNoTo: 200,
              PiNoFrom: 0,
              PiNoTo: 0,
              SpName: "",
              AcPRefNo: 0,
            }),
          }
        );

        const result = await response.json();
        setData(result.data || []);
      } catch (error) {
        console.error("Error fetching PI Register data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter data based on party name and PI number
  const filteredData = data.filter((item) => {
    const matchesPartyName = filters.partyName
      ? item.GrpFld1.toLowerCase().includes(filters.partyName.toLowerCase())
      : true;
    const matchesPINumber = filters.piNumber
      ? item.GrpFld2.toString().includes(filters.piNumber)
      : true;

    return matchesPartyName && matchesPINumber;
  });

  // Paginate data
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const renderItem = ({ item }: { item: PIRegisterData }) => (
    <View style={styles.tableRow}>
      <Text style={[styles.tableCell, styles.columnParty]}>{item.GrpFld1}</Text>
      <Text style={[styles.tableCell, styles.columnPi]}>{item.GrpFld2}</Text>
      <Text style={[styles.tableCell, styles.columnQty]}>{item.OdrTotQty}</Text>
      <Text style={[styles.tableCell, styles.columnArea]}>
        {item.OdrTotArea.toFixed(2)}
      </Text>
      <Text style={[styles.tableCell, styles.columnBaseAmt]}>
        {item.OdrBsAmt.toFixed(2)}
      </Text>
      <Text style={[styles.tableCell, styles.columnNetAmt]}>
        {item.OdrNetAmt.toFixed(2)}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={["#6a11cb", "#2575fc"]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.title}>PI Register</Text>
      </LinearGradient>

      {/* Filters */}
      <View style={styles.filterContainer}>
        <TextInput
          style={styles.filterInput}
          placeholder="Filter by Party Name"
          value={filters.partyName}
          onChangeText={(text) =>
            setFilters((prev) => ({ ...prev, partyName: text }))
          }
        />
        <TextInput
          style={styles.filterInput}
          placeholder="Filter by PI Number"
          value={filters.piNumber}
          keyboardType="numeric"
          onChangeText={(text) =>
            setFilters((prev) => ({ ...prev, piNumber: text }))
          }
        />
      </View>

      {/* Table */}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <ScrollView horizontal>
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, styles.columnParty]}>
                Party Name
              </Text>
              <Text style={[styles.tableHeaderText, styles.columnPi]}>
                PI Number
              </Text>
              <Text style={[styles.tableHeaderText, styles.columnQty]}>
                Total Qty
              </Text>
              <Text style={[styles.tableHeaderText, styles.columnArea]}>
                Total Area
              </Text>
              <Text style={[styles.tableHeaderText, styles.columnBaseAmt]}>
                Basic Amt
              </Text>
              <Text style={[styles.tableHeaderText, styles.columnNetAmt]}>
                Net Amt
              </Text>
            </View>
            <FlatList
              data={paginatedData}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </ScrollView>
      )}

      {/* Pagination */}
      <View style={styles.paginationContainer}>
        <TouchableOpacity
          disabled={currentPage === 1}
          onPress={() => setCurrentPage((prev) => prev - 1)}
          style={[
            styles.paginationButton,
            currentPage === 1 && styles.disabledButton,
          ]}
        >
          <Text style={styles.paginationText}>Previous</Text>
        </TouchableOpacity>
        <Text style={styles.paginationText}>
          Page {currentPage} of {totalPages}
        </Text>
        <TouchableOpacity
          disabled={currentPage === totalPages}
          onPress={() => setCurrentPage((prev) => prev + 1)}
          style={[
            styles.paginationButton,
            currentPage === totalPages && styles.disabledButton,
          ]}
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
    backgroundColor: "#f3f4f6",
  },
  header: {
    width: "100%",
    paddingVertical: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  filterInput: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginHorizontal: 5,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    margin: 10,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
  },
  tableHeaderText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    paddingHorizontal: 10,
  },
  tableRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  tableCell: {
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  columnParty: {
    width: 200,
  },
  columnPi: {
    width: 100,
  },
  columnQty: {
    width: 80,
  },
  columnArea: {
    width: 100,
  },
  columnBaseAmt: {
    width: 120,
  },
  columnNetAmt: {
    width: 120,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 10,
    marginBottom: 10,
  },
  paginationButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  disabledButton: {
    backgroundColor: "#ddd",
  },
  paginationText: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
  },
});

export default PIRegister;
