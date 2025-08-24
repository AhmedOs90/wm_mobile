import { useState } from 'react';
import ClientLayout from '@/components/shared/layout/ClientLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Star } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { companiesControllerGetCompanyJobs } from '@sdk.gen.ts';
import { LoadingSpinner } from '@/components/shared/ui';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { getProfileImage } from '@/lib/assetHelper';
import { useDebounce } from '@/hooks/useDebounce';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const Companies = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({ page: 1, perPage: 10 });
  
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const navigate = useNavigate();

  const { toast } = useToast();

  const {
    data: companiesJobs,
    isLoading: isLoadingCompaniesJobs,
    isError: isErrorCompaniesJobs,
    error: errorCompaniesJobs,
  } = useQuery({
    queryKey: ['companiesJobs', pagination.page, pagination.perPage, debouncedSearchTerm],
    queryFn: async () => {
      const response = await companiesControllerGetCompanyJobs({
        query: {
          search: debouncedSearchTerm,
          page: pagination.page.toString(),
          per_page: pagination.perPage.toString()
        }
      });
      
      return response.data;
    }
  });

  const companiesData = companiesJobs?.data || [];
  const totalItems = companiesJobs?.meta.total;
  const totalPages = Math.ceil(totalItems / pagination.perPage);
  const currentPage = pagination.page;

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPagination({ page: 1, perPage: Number(e.target.value) });
  };

  if (isErrorCompaniesJobs) {
    return (
      <ClientLayout>
        <div className="min-h-screen bg-background flex justify-center items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 flex flex-col justify-center items-center">
            <p className='text-red-600 font-semibold text-4xl'>No Companies Found</p>
            <Button variant='default' onClick={() => navigate('/')}>Return to home</Button>
          </div>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Companies</h1>
            <p className="text-muted-foreground">
              Discover top companies and explore career opportunities
            </p>
          </div>

          {/* Search and Rows Per Page */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input placeholder="Search companies..." defaultValue={searchTerm} className="pl-10"
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPagination(prev => ({ ...prev, page: 1 }));
                }
                }
              />
              {searchTerm !== debouncedSearchTerm && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Rows per page:</span>
              <select value={pagination.perPage} onChange={handlePerPageChange} className="border rounded p-1 text-sm" disabled={isLoadingCompaniesJobs}>
                {[5, 10, 20, 50].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Companies Table */}
          <Card>
            <CardHeader>
              <CardTitle>Companies Directory</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingCompaniesJobs ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Company</TableHead>
                        <TableHead>Industry</TableHead>
                        <TableHead>Employees</TableHead>
                        <TableHead>Open Jobs</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {companiesData.length > 0 ? (
                        companiesData.map((company) => {
                          return (
                            <TableRow key={company.id}>
                              <TableCell>
                                <div className="flex items-center space-x-3">
                                  <img
                                    src={getProfileImage(company.employer_profile.companyLogo)}
                                    onError={(e) => (e.target as HTMLImageElement).src = "/placeholder.svg"}
                                    alt={`${company.employer_profile.companyName} logo`}
                                    className="w-8 h-8 rounded object-cover bg-muted"
                                  />
                                  <span className="font-medium">{company.employer_profile.companyName}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">
                                  {company.employer_profile.industry?.industry || "N/A"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-1">
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  <span>N/A</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                {(company as any)._count.jobs}
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button variant="outline" size="sm">
                                    View Jobs
                                  </Button>
                                  <Button variant="ghost" size="sm" asChild>
                                    {/* <a href={company.webUrl || '#'} target="_blank" rel="noopener noreferrer">
                                      <ExternalLink className="w-4 h-4" />
                                    </a> */}
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            {debouncedSearchTerm ? `No companies match "${debouncedSearchTerm}"` : 'No companies found'}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-sm text-muted-foreground">
                        Showing {((currentPage - 1) * pagination.perPage) + 1}-
                        {Math.min(currentPage * pagination.perPage, totalItems)} of {totalItems} companies
                      </div>

                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious onClick={() => handlePageChange(Math.max(1, currentPage - 1))} aria-disabled={currentPage <= 1} />
                          </PaginationItem>

                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                              pageNum = i + 1;
                            } else if (currentPage <= 3) {
                              pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                              pageNum = totalPages - 4 + i;
                            } else {
                              pageNum = currentPage - 2 + i;
                            }

                            return (
                              <PaginationItem key={pageNum}>
                                <PaginationLink isActive={pageNum === currentPage} onClick={() => handlePageChange(pageNum)}>
                                  {pageNum}
                                </PaginationLink>
                              </PaginationItem>
                            );
                          })}

                          <PaginationItem>
                            <PaginationNext onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} aria-disabled={currentPage >= totalPages} />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ClientLayout>
  );
};

export default Companies;